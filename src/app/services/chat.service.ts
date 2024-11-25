import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';  // Ajusta a tu configuración de entorno

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private apiUrl = environment.apiUrl;  // URL de tu API (backend)
  private socketUrl = environment.socketUrl; // URL del servidor de Socket.IO

  constructor(private http: HttpClient) {
    // Conexión con Socket.IO en el backend
    this.socket = io(this.socketUrl, {  // Usamos socketUrl de environment
      transports: ['websocket'], // Asegura que se use WebSocket
    });

    // Verifica cuando la conexión sea exitosa
    this.socket.on('connect', () => {
      console.log('Conectado al servidor Socket.IO');
    });

    // Error al conectar
    this.socket.on('connect_error', (err) => {
      console.log('Error al conectar con Socket.IO:', err);
    });

    // Manejo de desconexión
    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor Socket.IO');
    });
  }

  // Unirse a una sala
  joinRoom(roomId: string): void {
    console.log(`Usuario uniéndose a la sala ${roomId}`);
    this.socket.emit('joinRoom', roomId);
  }

  // Salir de una sala
  leaveRoom(roomId: string): void {
    console.log(`Usuario saliendo de la sala ${roomId}`);
    this.socket.emit('leaveRoom', roomId);
  }

  // Enviar mensaje a la base de datos (API)
  sendMessageToApi(roomId: string, message: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/sendMessage`, { roomId, message, userId });
  }

  // Enviar mensaje a través de Socket.IO
  sendMessageToSocket(roomId: string, message: string, userId: string): void {
    const localTimestamp = this.formatLocalTimestamp(new Date()); // Marca de tiempo local
    this.socket.emit('sendMessage', { roomId, message, userId, timestamp: localTimestamp });
  }
  
  // Agrega la misma función para formatear la fecha
  private formatLocalTimestamp(date: Date): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  
  // Recibir mensajes de la sala en tiempo real
  receiveMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('newMessage', (message) => {
        observer.next(message); // Emitir el mensaje recibido
      });
  
      this.socket.on('disconnect', () => {
        observer.complete();
      });
  
      this.socket.on('connect_error', (err) => {
        observer.error(err);
      });
    });
  }

  // Recibir mensajes anteriores de la sala cuando el usuario se une
  receivePreviousMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('previousMessages', (messages) => {
        observer.next(messages); // Emitir los mensajes anteriores
      });
  
      this.socket.on('disconnect', () => {
        observer.complete();
      });
  
      this.socket.on('connect_error', (err) => {
        observer.error(err);
      });
    });
  }
}
