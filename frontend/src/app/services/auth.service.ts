import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { RegisterService } from './register.service';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TwoFactorAuthService } from './twoFactor.service';

@Injectable()
export class AuthService
{
	private isLoggedIn$ = new BehaviorSubject<boolean>(false);


	constructor(private http: HttpClient, private registerService: RegisterService, private router: Router, private twoFactorService: TwoFactorAuthService) {
		if (localStorage.getItem('user') !== null)
			this.isLoggedIn$.next(true);
	}

	isAuthenticated = (): Observable<boolean> => {
		return this.isLoggedIn$.asObservable();
	}

	authentication = (address: string, intraToken: string, callback: Function) => {
		this.http.get<Auth>(address + '/auth/user?code=' + intraToken).subscribe(
			res => {
				callback(address, res.jwt_token);
			},
			err => {
				console.log(err);
			}
		);
	}

	authenticateUser = (address: string, token: string) => {
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token}`
		});
		this.http.get<User>(address + '/users/me', { headers }).subscribe(
			res => {
				localStorage.setItem('user', JSON.stringify(res));
        localStorage.setItem('token', token);
        if (res.isSigned) {
			if (res.twoFactor === true)
			{
				localStorage.setItem('twoFactor', 'true');
				this.router.navigate(['/']);
				location.reload();
				return;
			}
			this.login();
        } else {
			this.registerService.beginRegister();
			return;
        }
    },
			err => {
				console.log(err);
			}
		);
	}

	login = () => {
		localStorage.removeItem('twoFactor');
		this.isLoggedIn$.next(true);
		this.router.navigate(['/']).then(r => console.log(r));
	}

	logout = () => {
		this.isLoggedIn$.next(false);
	}

	twoFactorAuth = (code: string) => {
		const user = JSON.parse(localStorage.getItem('user')!);
		this.twoFactorService.verifyTwoFactorAuth(code, user.username).subscribe(
			res => {
				if (res.isValid === true)
					this.login();
				else
					return false;
				return false;
			}
		);
		return false;
	};
}
