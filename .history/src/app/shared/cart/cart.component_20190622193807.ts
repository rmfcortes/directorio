import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  @Input('cartValue') cart;
  @Input('count') cuenta;
  @Output() abre = new EventEmitter();
  @Output() cierra = new EventEmitter();
  @Output() vacia = new EventEmitter();
  @Output() plus = new EventEmitter();
  @Output() minus = new EventEmitter();

  isOpen = false;
  costoEnv = 15;

  constructor() {
    console.log(this.cart);
   }

  ngOnInit() {}

  plusProduct(prod, index) {
    this.plus.emit({producto: prod, i: index});
  }

  minusProduct(prod, index) {
    this.minus.emit({producto: prod, i: index});
  }

  openCart() {
    this.isOpen = true;
    document.getElementById('mySidenav').style.height = '95%';
    document.getElementById('mySidenav').style.paddingTop = '0';
    document.getElementById('mySidenav').style.background = 'white';
    this.abre.emit();
  }

  closeCart() {
    this.isOpen = false;
    document.getElementById('mySidenav').style.height = '0';
    document.getElementById('mySidenav').style.paddingTop = '40px';
    document.getElementById('mySidenav').style.background = '#d6fccc';
    this.cierra.emit();
  }

  emptyCart() {
    this.cart = [];
    this.closeCart();
    this.vacia.emit();
  }

}
