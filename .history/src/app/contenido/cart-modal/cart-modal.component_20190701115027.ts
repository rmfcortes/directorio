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
    this.cartModal = [...this.cart];
  }

  // No cambien los productos
  // Suban o disminuyan
  // Vaciar el carro

  plusProduct(prod) {
    prod.cantidad++;
    prod.total += prod.precio;
  }

  minusProduct(prod) {
    this.minus.emit({producto: prod});
  }

  emptyCart() {
    this.cart = [];
    this.closeCart();
    this.vacia.emit();
  }

  closeCart() {
    if (this.cart === this.cartModal) {
      this.hayCambios = true;
    }
    console.log(this.hayCambios);
    this.modalCtrl.dismiss();
  }

}
