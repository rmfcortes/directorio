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

  regresar() {
    // regresar info producto agregado
    this.modalCtrl.dismiss();
  }

}
