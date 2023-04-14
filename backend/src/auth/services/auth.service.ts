import { HttpService } from '@nestjs/axios';
import { Body, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { error } from 'console';
import { catchError, firstValueFrom, lastValueFrom, map, throwError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

require('dotenv').config();
const UID = process.env.UID;
const SECRET=process.env.SEC;
const REDIRECT_URI=process.env.R_URI;
const JWT_SECRET=process.env.JWT_SECRET;

@Injectable()
export class AuthService {
    constructor(private readonly httpService: HttpService, private prisma: PrismaService, private jwt: JwtService){}

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

	async signup(rdata, intraToken)
	{
		const user = await this.prisma.user.create({
			data: {
				intraId: rdata["id"],
				username: rdata["login"],
				email: rdata["email"],
			}});
		return this.signToken(intraToken, user.intraId);
	}

	async signin(rdata, intraToken)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				intraId: rdata["id"],
			}
		});
		if (!user)
			return this.signup(rdata, intraToken);
		return this.signToken(intraToken, user.intraId);
	}

	signToken = async (intraToken, intraId): Promise<{jwt_token: string}> => {
		const payload = {
			intraToken,
			intraId,
		};	
		const token =  await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: JWT_SECRET
		});
		return {
			jwt_token: token,
		};
	}


    async login(code: string)
    {
        const intraToken = await this.getToken(code);
        const rdata  = await this.getUser(intraToken);
		const jwtToken = await this.signin(rdata, intraToken.access_token);
		console.log("jwtToken", jwtToken);
		return jwtToken;
    }

	async register(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				intraId: id,
			}
		});
		await this.prisma.user.update({
			where: {
				intraId: user.intraId,
			},
			data: {
				isSigned: true,
			}
		});
		return user;
	}

	async getUserIntraId(token: string) {
		return (
			await this.jwt.verifyAsync(token, {
				secret: JWT_SECRET,
			})
		).intraId;	
	}

	
}
