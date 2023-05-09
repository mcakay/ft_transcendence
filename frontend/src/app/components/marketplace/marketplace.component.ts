import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { RouterService } from 'src/app/services/route.service';

interface Item {
  id:number;
  name: string;
  price: number;
  image: string;
  quantity:number;
}


@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent {

  user!: User;
  id!: number;
  isbuyed:boolean = false;


  availableItems: Item[] = [
    {
      id:1,
      name: 'Ürün 1',
      price: 10,
      image: 'https://thumbs.dreamstime.com/b/coffe-illustration-white-background-61914260.jpg',
      quantity:0
    },
    {
      id:2,
      name: 'Ürün 2',
      price: 20,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    },
    {
      id:3,
      name: 'Ürün 3',
      price: 30,
      image: 'data:image/jpeg;base64,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',
      quantity:0
    }
    ,
    {
      id:4,
      name: 'Ürün 4',
      price: 20,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    },
    {
      id:5,
      name: 'Ürün 5',
      price: 55,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    },
    {
      id:6,
      name: 'Ürün 6',
      price: 100,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    },
    {
      id:7,
      name: 'Ürün 7',
      price: 200,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    },
    {
      id:8,
      name: 'Ürün 2',
      price: 20,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    },
    {
      id:9,
      name: 'Ürün 2',
      price: 20,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    },
    {
      id:10,
      name: 'Ürün 2',
      price: 20,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    },
    {
      id:11,
      name: 'Ürün 2',
      price: 20,
      image: 'https://previews.123rf.com/images/jiewsurreal/jiewsurreal2003/jiewsurreal200300044/144040498-art-sugar-skull-day-of-the-dead-hand-watercolor-painting-on-paper.jpg',
      quantity:0
    }
  ];

  purchasedItems: Item[] = [];
  
  
  constructor(private userService:UserService,public routerService:RouterService){
    this.user = this.userService.getUser()!;
    this.id = this.user.intraId;
  }


  addToCart(item: Item) {
    const index = this.purchasedItems.findIndex(i => i.id === item.id);
    if (index === -1) {
      item.quantity = 1;
      this.purchasedItems.push(item);
    } else {
      this.purchasedItems[index].quantity += 1;
    }
  }

  removeFromCart(item: Item) {
    const index = this.purchasedItems.indexOf(item);
    if (index >= 0) {
      this.purchasedItems.splice(index, 1);
    }
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let item of this.purchasedItems) {
      totalPrice += item.price * item.quantity;
    }
    return totalPrice;
  }
  

  decreaseQuantity(item: Item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(item);
    }
  }
  
  increaseQuantity(item: Item) {
    item.quantity++;
  }
  buybasket(){
    
    const totalPrice = this.getTotalPrice();

    if (totalPrice <= this.user.rating) {
      const myletmoney = this.user.rating - totalPrice; 
      this.purchasedItems = [];
		this.userService.updateUser(this.user, () => {
			this.user.rating = myletmoney;
			return { rating: this.user.rating};
		  },  myletmoney);
      this.isbuyed = true;
      setTimeout(() => {
        this.isbuyed = false;
    }, 2000);

    }
  }
}