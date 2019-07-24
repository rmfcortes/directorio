import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ficha-producto',
  templateUrl: './ficha-producto.page.html',
  styleUrls: ['./ficha-producto.page.scss'],
})
export class FichaProductoPage implements OnInit {

  @Input() producto;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.producto);
  }

  actualizaCart(data) {
    const carrito = data.cart;
    if (carrito.length > 0) {
      carrito.forEach(prod => {
        const i = this.productos.findIndex(p => p.nombre === prod.pasillo);
        const y = this.productos[i].productos.findIndex(p => p.id === prod.id);
        if (i >= 0 && y >= 0) {
          this.productos[i].productos[y].cantidad = prod.cantidad;
          this.productos[i].productos[y].total = prod.cantidad * prod.precio;
          if (prod.cantidad === 0 ) {
            this.productos[i].productos[y].cart = false;
          }
        }
      });
      this.pasilloService.updateCart(carrito, data.cuenta, this.id);
    } else {
      this.emptyCart();
    }
  }

  emptyCart() {
    this.pasilloService.clearCart(this.id);
    this.productos.forEach(pasillo => {
      pasillo.productos.forEach(producto => {
        if (producto.cantidad) {
          delete producto.cantidad;
          delete producto.total;
          delete producto.cart;
        }
      });
    });
  }

  regresar() {
    // regresar info producto agregado
    this.modalCtrl.dismiss();
  }

}
