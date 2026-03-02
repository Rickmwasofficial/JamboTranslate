import { GoogleGenAI, Modality } from "@google/genai";
import { AppMode, Language } from "../types";

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private session: any = null;
  private onMessage: (text: string, role: 'user' | 'model', isInterrupted: boolean) => void;
  private onAudio: (base64: string) => void;
  private onStatus: (status: 'connected' | 'disconnected' | 'error') => void;

  constructor(
    onMessage: (text: string, role: 'user' | 'model', isInterrupted: boolean) => void,
    onAudio: (base64: string) => void,
    onStatus: (status: 'connected' | 'disconnected' | 'error') => void
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    this.onMessage = onMessage;
    this.onAudio = onAudio;
    this.onStatus = onStatus;
  }

  async connect(mode: AppMode, userLang: Language) {
    const systemInstruction = mode === 'translation' 
      ? `You are a professional real-time interpreter between Swahili and English. 
         STRICT RULE: ONLY output the translation of what the user says. 
         - If the user speaks Swahili, output ONLY the English translation.
         - If the user speaks English, output ONLY the Swahili translation.
         - Do NOT add greetings, explanations, or conversational filler.
         - Maintain the tone and meaning of the original speech exactly.`
      : `You are a multilingual AI assistant fluent in both Swahili and English.
         Engage naturally with the user in their chosen language.
         If asked, provide translations or explanations in the other language.
         Be helpful, friendly, and culturally aware.`;

    try {
      this.session = await this.ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live connected");
            this.onStatus('connected');
          },
          onmessage: async (message) => {
            // 1. Handle Audio
            if (message.serverContent?.modelTurn) {
              const parts = message.serverContent.modelTurn.parts;
              for (const part of parts) {
                if (part.inlineData) {
                  this.onAudio(part.inlineData.data);
                }
              }
            }
            
            // 2. Handle Interruption
            if (message.serverContent?.interrupted) {
              this.onMessage("", 'model', true);
            }

            // 3. Handle Model Transcription
            if (message.serverContent?.modelTurn?.parts) {
                const text = message.serverContent.modelTurn.parts
                  .map(p => p.text)
                  .filter(Boolean)
                  .join("");
                if (text) this.onMessage(text, 'model', false);
            }

            // 4. Handle User Transcription
            const serverContent = message.serverContent as any;
            if (serverContent?.inputTranscription?.transcription) {
                this.onMessage(serverContent.inputTranscription.transcription, 'user', false);
            }
          },
          onclose: () => {
            console.log("Gemini Live closed");
            this.onStatus('disconnected');
          },
          onerror: (err) => {
            console.error("Gemini Live error:", err);
            this.onStatus('error');
          }
        }
      });
    } catch (error) {
      console.error("Failed to connect to Gemini Live:", error);
      this.onStatus('error');
    }
  }

  sendAudio(base64: string) {
    if (this.session) {
      this.session.sendRealtimeInput({
        media: { data: base64, mimeType: 'audio/pcm;rate=16000' }
      });
    }
  }

  disconnect() {
    this.session?.close();
    this.session = null;
  }
}
