import { Component, OnInit, } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit {

  imagen = this.navParams.get('value');
  noLongerExist = false;

  constructor(public modalController: ModalController,
              private navParams: NavParams) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
  }

  regresar() {
    this.modalController.dismiss({
      // 'result': 'prueba'
    });

  }

}
