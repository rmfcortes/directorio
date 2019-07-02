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

  original
  hayCambios = false;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.original = JSON.stringify(this.cart);
  }

  // No cambien los productos
  // Suban o disminuyan
  // Vaciar el carro

  plusProduct(i) {
    console.log(this.cart[i]);
    this.cart[i].cantidad++;
    this.cart[i].total += this.cart[i].precio;
  }

  minusProduct(i) {
    this.cart[i].cantidad--;
    this.cart[i].total -= this.cart[i].precio;
  }

  emptyCart() {
    this.cart = [];
    this.closeCart();
    this.vacia.emit();
  }

  closeCart() {
    console.log(JSON.stringify(this.cart));
    console.log(JSON.stringify(this.original));
    if (JSON.stringify(this.cart) !== this.original) {
      this.hayCambios = true;
    }
    console.log(this.hayCambios);
    this.modalCtrl.dismiss();
  }

}
