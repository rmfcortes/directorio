import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PasillosService } from 'src/app/services/pasillos.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  @Output() abre = new EventEmitter();
  @Output() cierra = new EventEmitter();
  @Output() vacia = new EventEmitter();
  @Output() plus = new EventEmitter();
  @Output() minus = new EventEmitter();

  cantidad: number;
  cuenta: number;
  cart = [];

  costoEnv = 15;
  isOpen = false;

  constructor(
    private pasilloService: PasillosService
  ) { }

  ngOnInit() {
    this.pasilloService.cantidad.subscribe(valor => {
      this.cantidad = valor;
    });
    this.pasilloService.cuenta.subscribe(valor => {
      this.cuenta = valor;
    });
    this.pasilloService.cart.subscribe(valor => {
      this.cart = valor;
    });
  }

  plusProduct(prod) {
    this.plus.emit({producto: prod});
  }

  minusProduct(prod, index, indexy?) {
    this.minus.emit({producto: prod});
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
