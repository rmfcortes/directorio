import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {

  @Input() cart;
  @Input() cuenta;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  emptyCart() {
    this.cart = [];
    this.closeCart();
    this.vacia.emit();
  }

  closeCart() {
    this.modalCtrl.dismiss();
  }

}
