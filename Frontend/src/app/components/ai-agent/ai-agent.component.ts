import { Component, ElementRef, ViewChild, HostListener, NgZone } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../../src/environments/environment'; // 👈 Environment import

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
  id?: number;
}

interface ExtendedWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-ai-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ai-agent.component.html',
  styleUrls: ['./ai-agent.component.css']
})
export class AiAgentComponent {
  @ViewChild('chatHistoryContainer') private chatHistoryContainer!: ElementRef;
  @ViewChild('textInput') textInput!: ElementRef;

  showChat = false;
  question = '';
  chatHistory: ChatMessage[] = [];
  loading = false;
  newMessageAlert = false;
  isDragging = false;
  isListening = false;

  private recognition: any;
  private speechRecognitionActive = false;

  private initialX: number = 0;
  private initialY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;

  quickPrompts = [
    "Show me basic guitar chords",
    "How to play Wonderwall?",
    "Best exercises for finger strength",
    "Explain barre chords"
  ];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private ngZone: NgZone) {
    if (typeof window !== 'undefined') {
      const extendedWindow = window as unknown as ExtendedWindow;
      const SpeechRecognitionRef = extendedWindow.SpeechRecognition || extendedWindow.webkitSpeechRecognition;

      if (SpeechRecognitionRef) {
        this.recognition = new SpeechRecognitionRef();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          this.ngZone.run(() => {
            const transcript = event.results[0][0].transcript;
            this.question = transcript;
            this.isListening = false;
            this.speechRecognitionActive = false;
            if (transcript.trim() !== '') {
              this.ask();
            }
          });
        };

        this.recognition.onerror = (event: any) => {
          this.ngZone.run(() => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.speechRecognitionActive = false;
            this.scrollToBottom();
          });
        };

        this.recognition.onend = () => {
          this.ngZone.run(() => {
            this.isListening = false;
            this.speechRecognitionActive = false;
          });
        };
      } else {
        console.warn('Web Speech API is not supported in this browser.');
      }
    }
  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat) {
      setTimeout(() => {
        this.textInput.nativeElement.focus();
        this.scrollToBottom();
      }, 0);
    } else {
      if (this.isListening) {
        this.stopVoiceInput();
      }
    }
  }

  handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.ask();
    }
  }

  ask() {
    if (!this.question.trim() || this.loading) return;

    if (this.isListening) {
      this.stopVoiceInput();
    }

    const userMessage: ChatMessage = {
      text: this.question,
      sender: 'user',
      timestamp: new Date(),
      id: Date.now()
    };

    this.chatHistory.push(userMessage);
    this.question = '';
    this.loading = true;
    this.scrollToBottom();

    this.http.post<{ answer: string }>(`${environment.apiUrl}/ask`, {
      question: userMessage.text
    }).subscribe({
      next: (res) => {
        this.chatHistory.push({
          text: res.answer,
          sender: 'ai',
          timestamp: new Date(),
          id: Date.now()
        });
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.chatHistory.push({
          text: 'Oops! Something went wrong. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
          id: Date.now()
        });
        this.loading = false;
        this.scrollToBottom();
      }
    });
  }

  trackByMessage(index: number, message: ChatMessage): number {
    return message.id || index;
  }

  toggleVoiceInput() {
    if (!this.recognition) {
      this.chatHistory.push({
        text: "Voice input is not supported in your browser or environment. Please use text input.",
        sender: 'ai',
        timestamp: new Date()
      });
      this.scrollToBottom();
      return;
    }

    if (this.speechRecognitionActive) {
      this.stopVoiceInput();
    } else {
      this.startVoiceInput();
    }
  }

  private startVoiceInput() {
    if (this.recognition && !this.speechRecognitionActive) {
      this.isListening = true;
      this.speechRecognitionActive = true;
      this.question = 'Listening...';
      this.recognition.start();
      console.log('Voice input started.');
    }
  }

  private stopVoiceInput() {
    if (this.recognition && this.speechRecognitionActive) {
      this.recognition.stop();
      this.isListening = false;
      this.speechRecognitionActive = false;
      if (this.question === 'Listening...') {
        this.question = '';
      }
      console.log('Voice input stopped.');
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatHistoryContainer) {
        this.chatHistoryContainer.nativeElement.scrollTop =
          this.chatHistoryContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  parseMarkdown(text: string): SafeHtml {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  setQuestion(prompt: string) {
    this.question = prompt;
    this.ask();
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.initialX = event.clientX - this.currentX;
    this.initialY = event.clientY - this.currentY;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    this.currentX = event.clientX - this.initialX;
    this.currentY = event.clientY - this.initialY;

    const chatWindow = document.querySelector('.animate-slide-up-fade') as HTMLElement;
    if (chatWindow) {
      chatWindow.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Optional: reset or constrain chat position
  }
}
