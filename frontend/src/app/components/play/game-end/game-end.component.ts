import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Match } from 'src/app/models/match.model';
import { AchievementService } from 'src/app/services/achievement.service';
import { MatchService } from 'src/app/services/match.service';

@Component({
	selector: 'app-game-end',
	templateUrl: './game-end.component.html',
	styleUrls: ['./game-end.component.scss']
})
export class GameEndComponent {

	game!: Match;

	constructor(private matchService: MatchService, private router: Router) { }

	ngOnInit(): void {
		this.matchService.getLastMatch().then((match) => {
			this.game = match!;
		});
	};

	homeButton = () => {
		this.router.navigate(['home']);
	};
	
	rematchButton = () => {
		this.router.navigate(['play']);
	};
}
