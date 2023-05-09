import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: number, data: any) {
    const user: User = await this.prisma.user.update({
      where: {
        intraId: id,
      },
      data: data,
    });
    return user;
  }

  async getUserById(intraId: number): Promise<User> {
    console.log("girdi bebek burda dördüncü durağı intraid");
    return this.prisma.user.findUnique({
      where: {
        intraId: parseInt(intraId.toString())
      }
    });
  }


}
