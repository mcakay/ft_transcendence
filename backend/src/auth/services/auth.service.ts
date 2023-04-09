import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error } from 'console';
import { catchError, firstValueFrom, lastValueFrom, map, throwError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

require('dotenv').config();
const UID = process.env.UID;
const SECRET=process.env.SEC;
const REDIRECT_URI=process.env.R_URI;

@Injectable()
export class AuthService {
    constructor(private readonly httpService: HttpService, private prisma: PrismaService){}

    async getToken(code)
    {
        try {
            const data =  {
                grant_type: 'authorization_code',
                client_id: UID,
                client_secret: SECRET,
                code: code,
                redirect_uri: REDIRECT_URI,
            };
			console.log("data", data);	
            const response = await firstValueFrom(this.httpService.post('https://api.intra.42.fr/oauth/token', data).pipe(map(response => response.data)).pipe(catchError((err) => {
                console.error('HTTP Error:', err.message);
                return throwError('HTTP Error Occurred');
              })));
            return response;
        }
        catch {error}
        {
            return new HttpException('login ERROR', 500);
        }
    }

    async getUser(token)
    {
        try {
            const res = await lastValueFrom(this.httpService.get('https://api.intra.42.fr/v2/me', {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`
                }
                }).pipe(map(response => response.data)));
            return res;
        }
        catch {error}
        {
            return new HttpException('getUser ERROR', 500);
        }
    }

	async signup(rdata)
	{
		const user = await this.prisma.user.create({
			data: {
				intraId: rdata["id"],
				username: rdata["login"],
				nickname: rdata["displayname"],
				email: rdata["email"],
				avatarUrl: rdata["image"]["link"],
			}});
		console.log("user", user);
	}

	async signin(rdata)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				intraId: rdata["id"]
			}
		});
		console.log("user", user);
	}

    async login(code: string)
    {
        const token = await this.getToken(code);
        const rdata  = await this.getUser(token);
		let user;
		try {
			this.signin(rdata);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
				this.signup(rdata);
			}
		}
    }
}
