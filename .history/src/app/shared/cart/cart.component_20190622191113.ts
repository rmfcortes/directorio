import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  isOpen = fasle;

  constructor() { }

  ngOnInit() {}

  openCart() {
    this.isOpen = true;
    document.getElementById('mySidenav').style.height = '95%';
    document.getElementById('mySidenav').style.paddingTop = '0';
    document.getElementById('mySidenav').style.background = 'white';
  }

  closeCart() {
    this.isOpen = false;
    document.getElementById('mySidenav').style.height = '0';
    document.getElementById('mySidenav').style.paddingTop = '40px';
    document.getElementById('mySidenav').style.background = '#d6fccc';
  }

}
