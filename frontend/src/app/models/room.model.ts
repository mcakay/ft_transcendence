import { MetaInterface } from "./meta.model";
import { User } from "./user.model";


export interface RoomInterface{
    id: number;
    name: string;
    users: User[];
    isPrivate: boolean;
    ownerId: number;
}

export interface RoomPaginateInterface{
    items: RoomInterface[];
    meta: MetaInterface;
}




/*
 id        Int     @id @default(autoincrement())
  name      String
  users     User[]  @relation("RoomUser")
  isPrivate Boolean @default(false)
  ownerId   Int     @unique
    */