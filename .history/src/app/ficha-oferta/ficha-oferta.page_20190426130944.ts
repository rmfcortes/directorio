import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit {

  imagen: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  regresar() {
    this.modalController.dismiss({
      'result': 'prueba'
    });

  }

}
