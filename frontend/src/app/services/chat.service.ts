import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})


export class ChatService {

  constructor(private socket: Socket) {}

  createRoom(roomName: string, password?: string) {
    console.log(roomName)
    this.socket.emit('createRoom', { roomName, password });
  }

  joinRoom(roomId: string, password?: string) {
    this.socket.emit('joinRoom', { roomId, password });
  }

  leaveRoom(roomId: string) {
    this.socket.emit('leaveRoom', roomId);
  }

  sendMessage(roomId: string, message: string) {
    this.socket.emit('sendMessage', { roomId, message });
  }

  getRooms() {
    return this.socket.fromEvent('rooms');
  }

  getMessages(roomID: string) {
    return this.socket.fromEvent('messages');
  }
  
  roomCreated()
  {
    return this.socket.fromEvent('roomCreated');
  }

  userJoined()
  {
    return this.socket.fromEvent('userJoined');
  }

  receiveMessage()
  {
    return this.socket.fromEvent('receiveMessage');
  }

}
