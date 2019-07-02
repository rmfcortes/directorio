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

  cartModal: Producto[];
  hayCambios = false;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.cartModal = [...this.cart];
    console.log(this.cartModal);
  }

  // No cambien los productos
  // Suban o disminuyan
  // Vaciar el carro

  plusProduct(i) {
    console.log(this.cartModal[i]);
    this.cartModal[i].cantidad++;
    this.cartModal[i].total += this.cartModal[i].precio;
  }

  minusProduct(i) {
    this.cartModal[i].cantidad--;
    this.cartModal[i].total -= this.cartModal[i].precio;
  }

  emptyCart() {
    this.cart = [];
    this.closeCart();
    this.vacia.emit();
  }

  closeCart() {
    if (JSON.stringify(this.cart) !== JSON.stringify(this.cartModal)) {
      this.hayCambios = true;
    }
    console.log(this.hayCambios);
    this.modalCtrl.dismiss();
  }

}
