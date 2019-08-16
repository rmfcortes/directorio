import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss'],
})
export class DetallePedidoComponent implements OnInit {

  @Input() direccion;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  regresar() {
    this.modalCtrl.dismiss();
  }

}
