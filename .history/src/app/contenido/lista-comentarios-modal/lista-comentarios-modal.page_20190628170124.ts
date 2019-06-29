import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-comentarios-modal',
  templateUrl: './lista-comentarios-modal.page.html',
  styleUrls: ['./lista-comentarios-modal.page.scss'],
})
export class ListaComentariosModalPage implements OnInit {

  @Input() data: string;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log('Init');
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
