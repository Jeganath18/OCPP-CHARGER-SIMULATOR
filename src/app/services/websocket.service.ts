import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  [x: string]: any;
  private socket!: WebSocket;
  private connectionStatusSubject: Subject<string> = new Subject<string>();
  public connectionStatus$: Observable<string> = this.connectionStatusSubject.asObservable();
  private messageSubject = new Subject<string>();
  public messages$ = this.messageSubject.asObservable();


  connect(url: string): void {
    this.socket = new WebSocket(url,'ocpp1.6');


    // Handle connection open
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.connectionStatusSubject.next('WebSocket connection established');
    };

    // Handle messages
    this.socket.onmessage = (event) => {
      console.log('Message received:', event.data);
      this.messageSubject.next(event.data);

    };

    // Handle errors
    this.socket.onerror = (error) => {
      console.error('WebSocket error.........:', error);
      this.connectionStatusSubject.next('WebSocket error occurred');

    };

    // Handle connection close
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.connectionStatusSubject.next('WebSocket connection closed');
    };
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }
  disconnect(): void {
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
        console.log('WebSocket connection is being closed');
      } else {
        console.log('WebSocket connection is already closed');
      }
      this.connectionStatusSubject.next('WebSocket connection closedd');
    } else {
      console.error('WebSocket is not initialized');
    }
  }

}


