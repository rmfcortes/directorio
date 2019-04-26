import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit, AfterViewInit {

  imagen: string;

  @Input() value: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.imagen = this.value;
  }

  regresar() {
    this.modalController.dismiss({
      'result': 'prueba'
    });

  }

}
