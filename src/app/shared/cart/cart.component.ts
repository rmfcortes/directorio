import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PasillosService } from 'src/app/services/pasillos.service';
import { ModalController } from '@ionic/angular';
import { InfoSucursalModalPage } from 'src/app/contenido/info-sucursal-modal/info-sucursal-modal.page';
import { CartModalComponent } from 'src/app/contenido/cart-modal/cart-modal.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  @Output() actualiza = new EventEmitter();
  @Output() cierra = new EventEmitter();
  @Input() telefono;
  @Input() nombre;
  @Input() id;
  @Input() preparacion;

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

  async openCart() {
    const modal = await this.modalController.create({
      component: CartModalComponent,
      componentProps: { cart: this.cart,
                        cuenta: this.cuenta,
                        costoEnv: this.costoEnv,
                        id: this.id,
                        telefono: this.telefono,
                        nombre: this.nombre,
                        preparacion: this.preparacion
                      }
    });

    modal.onWillDismiss().then(async (resp) => {
      if (!resp.data) {
        return;
      }
      if (resp.data.cierra) {
        this.cierra.emit(true);
        return;
      }
      if (!resp.data.cart || resp.data.cart.length === 0) {
        this.cuenta = 0;
        this.cantidad = 0;
        this.cart = [];
      } else {
        this.cuenta = resp.data.cuenta;
        this.cantidad = this.cart.length;
        this.cart = resp.data.cart;
      }
      this.actualiza.emit({cart: this.cart, cuenta: this.cuenta});
    });

    return await modal.present();
  }

}
