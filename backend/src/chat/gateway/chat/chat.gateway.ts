import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';





@WebSocketGateway({ cors: { origin: ['http://10.11.242.115:3131', 'http://10.11.242.115:6969'] } })

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  constructor() {}
  
  
  @WebSocketServer()
  server: Server

  private rooms: { [key: string]: string} =  {};
  
  afterInit(server: Server) {
    console.log("Server initialized aaaaaaaaaaa");
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected", client.id);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log("Client connected:" + client.id);
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: any, data: { name: string, password?: string }){
     const roomName= data.name;
    // if (roomName)
    //  {
      const roomID = this.generateRoomId();
      console.log(roomID)
      this.rooms[roomID] = data.password ? data.password : '';
      client.join(roomID);
      client.emit('roomCreated', { roomID, roomName });
   // }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: any, roomID: string)
  {
    if (roomID in this.rooms)
    {
      client.join(roomID);
      client.emit('roomJoined', roomID);
    }
    else 
    {
      client.emit("invalidRoom");
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: any, data: { roomID: string, message: string })
  {
    console.log("Message received:"+ data.message);
    client.to(data.roomID).emit('newMessage', { message: data.message});
    
  }

  private generateRoomId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }




  

}
