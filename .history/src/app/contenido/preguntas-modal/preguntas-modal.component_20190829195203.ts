import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-preguntas-modal',
  templateUrl: './preguntas-modal.component.html',
  styleUrls: ['./preguntas-modal.component.scss'],
})
export class PreguntasModalComponent {

  @Input() value: any;

  infoReady = false;
  hasPreguntas = false;

  constructor(
    private modalController: ModalController
  ) { }

  async regresar() {
    await this.modalController.dismiss();
  }

}
