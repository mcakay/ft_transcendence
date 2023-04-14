import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SocialComponent } from './social/social.component';


const routes: Routes = [
	{
		path: 'play',
		component: PlayComponent
	},
	{
		path: 'profile',
		component: ProfileComponent
	},
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'social',
		component: SocialComponent
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
 