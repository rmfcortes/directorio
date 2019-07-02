import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/interfaces/negocio.interface';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {

  @Input() cart: Producto[];
  @Input() cuenta;
  @Input() costoEnv;

  original: string;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.original = JSON.stringify(this.cart);
  }

  plusProduct(i) {
    this.cart[i].cantidad++;
    this.cart[i].total += this.cart[i].precio;
    this.cuenta += this.cart[i].precio;
  }

  minusProduct(i) {
    this.cart[i].cantidad--;
    this.cart[i].total -= this.cart[i].precio;
    this.cuenta -= this.cart[i].precio;
    console.log(this.cart[i].cantidad);
    if (this.cart[i].cantidad === 0) {
      this.cart.splice(i, 1);
    }
  }

  emptyCart() {
    this.cart = [];
    this.modalCtrl.dismiss({cart: this.cart});
  }

  closeCart() {
    if (JSON.stringify(this.cart) !== this.original) {
      this.modalCtrl.dismiss({cart: this.cart});
    }
    this.modalCtrl.dismiss(null);
  }

}
