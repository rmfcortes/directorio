import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PasillosService } from 'src/app/services/pasillos.service';
import { ModalController } from '@ionic/angular';
import { InfoSucursalModalPage } from 'src/app/contenido/info-sucursal-modal/info-sucursal-modal.page';
import { HorarioModalPage } from 'src/app/contenido/horario-modal/horario-modal.page';
import { CartModalComponent } from 'src/app/contenido/cart-modal/cart-modal.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  @Output() vacia = new EventEmitter();
  @Output() plus = new EventEmitter();
  @Output() minus = new EventEmitter();

  cantidad: number;
  cuenta: number;
  cart = [];

  costoEnv = 15;

  constructor(
    private modalController: ModalController,
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

  minusProduct(prod) {
    this.minus.emit({producto: prod});
  }

  async openCart() {
    const modal = await this.modalController.create({
      component: CartModalComponent,
      componentProps: { cart: this.cart,
                        cuenta: this.cuenta,
                        costoEnv: this.costoEnv
                      }
    });

    const resp = await modal.onWillDismiss();
    console.log(resp.data);

    return await modal.present();
  }

}
