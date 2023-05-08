import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss','../../profile/profile.component.scss']
})
export class NavigationComponent {
  path: string = '../assets/icons/';

	pages = [
		{
			title: 'Home',
			url: '/home',
			icon: this.path + 'home.png'
		},
		{
			title: 'Achievements',
			url: '/achievements',
			icon: this.path + 'achievement.png'
		},
		{
			title: 'Match History',
			url: '/history',
			icon: this.path + 'history.png'
		},
		{
			title: 'Purchases',
			url: '/purchases',
			icon: this.path + 'purchases.png'
		}
	]
}
