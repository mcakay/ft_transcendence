import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterService } from 'src/app/services/route.service';

@Component({
	selector: 'app-marketplace',
	templateUrl: './marketplace.component.html',
	styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent {

	constructor(public routerService: RouterService){}

}
