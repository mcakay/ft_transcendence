import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { environment } from 'src/environment/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable(
	{providedIn: 'root' }
)
export class RegisterService
{
	private isRegister$ = new BehaviorSubject<boolean>(false);

	constructor(private http: HttpClient, private userService: UserService, private router: Router){
		const user = this.userService.getUser();
		if (user !== null && !user.isSigned)
			this.beginRegister();
	}

	checkNickname = (nickname: String) => {
		if (nickname.length < 4 || nickname.length > 11)
			return false;
		if (!nickname.match(/^[a-zA-Z0-9]+$/))
			return false;
		if (nickname[0].match(/[0-9]/))
			return false;
		return true;
	}

	isRegister = (): Observable<boolean> => {
		return this.isRegister$.asObservable();
	}

	beginRegister = () => {
		this.isRegister$.next(true);
		this.router.navigate(['/register']).then(r => console.log(r));
	}

	completeRegister = (callback: Function, selectedAvatar: string, selectedNickname: string) => {
		const user = this.userService.getUser()!;
		const body = { intraId: user.intraId}
		this.userService.updateUser(user, () => {
			user.avatarUrl = selectedAvatar;
			return { avatarUrl: selectedAvatar };
		}, selectedAvatar);
		this.userService.updateUser(user, () => {
			user.nickname = selectedNickname;
			return { nickname: selectedNickname };
		}, selectedNickname);
		user.isSigned = true;
		localStorage.setItem('user', JSON.stringify(user));
		this.http.post(environment.address + '/auth/register', body).subscribe(
			res => {
				console.log(res);
			},
			err => {
				console.log("Error: ", err);
			}
		);

		this.isRegister$.next(false);
		callback();
	}
}
