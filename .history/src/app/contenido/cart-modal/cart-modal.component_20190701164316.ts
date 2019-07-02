import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/interfaces/negocio.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Direccion } from 'src/app/interfaces/usuario.interfaces';

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
  direccion: string;
  direcciones: Direccion[];

  constructor(
    private modalCtrl: ModalController,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.original = JSON.stringify(this.cart);
    const direccion: Direccion = await this.usuarioService.getUltimaDireccion();
    this.direccion = direccion.direccion || 'Agrega una dirección de entrega';
    this.direcciones = await this.usuarioService.getDirecciones();
  }

  plusProduct(i) {
    this.cart[i].cantidad++;
    this.cart[i].total += this.cart[i].precio;
    this.cuenta += this.cart[i].precio;
  }

  minusProduct(i) {
    if (this.cart[i].cantidad === 0) { return; }
    this.cart[i].cantidad--;
    this.cart[i].total -= this.cart[i].precio;
    this.cuenta -= this.cart[i].precio;
  }

  emptyCart() {
    this.cart = [];
    this.modalCtrl.dismiss({cart: this.cart, cuenta: 0});
  }

  closeCart() {
    if (JSON.stringify(this.cart) !== this.original) {
      this.modalCtrl.dismiss({cart: this.cart, cuenta: this.cuenta});
    }
    this.modalCtrl.dismiss(null);
  }

}
