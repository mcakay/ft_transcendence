import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})


export class SocialComponent implements OnInit {
  
  rooms: any[] = [];
  currentRoomID: string = '';
  newRoomName: string = '';
  isRoomPasswordProtected: boolean = false;
  roomPassword: string = '';
  messages: any[] = [];
  newMessage: string = '';
  

  constructor(private chatService: ChatService) { }
  
  ngOnInit(): void {
    this.chatService.getRooms().subscribe((rooms: any) => {
      this.rooms = rooms;
    });
    this.chatService.roomCreated().subscribe((room: any) => {
      this.rooms.push(room);
    });
    this.chatService.receiveMessage().subscribe((message: any) => {
      this.messages.push(message);
    });
  }

  createNewRoom(event: Event): void
  {

    event.preventDefault();
    if (this.newRoomName)
    {
      const roomData = {
        name: this.newRoomName,
        password: this.isRoomPasswordProtected ? this.roomPassword : undefined
      };
      this.chatService.createRoom(roomData.name, roomData.password);
      this.newRoomName = '';
      this.isRoomPasswordProtected = false;
      this.roomPassword = '';
    }
  }

  joinRoom(roomId: string): void
  {
    this.currentRoomID = roomId;
    this.chatService.joinRoom(roomId);
  }


  sendMessage(): void{
    if (this.messages)
    {
      this.chatService.sendMessage(this.currentRoomID, this.newMessage);
      this.newMessage = '';
    }
  }


}
