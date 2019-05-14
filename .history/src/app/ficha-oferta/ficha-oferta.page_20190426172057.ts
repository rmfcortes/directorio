import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit {

  imagen = this.navParams.get('value');

  constructor(public modalController: ModalController,
              private navParams: NavParams) { }

  ngOnInit() {
  }

  regresar() {
    this.modalController.dismiss({
      // 'result': 'prueba'
    });

  }

}
