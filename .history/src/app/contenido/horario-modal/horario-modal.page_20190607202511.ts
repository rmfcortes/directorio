import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-horario-modal',
  templateUrl: './horario-modal.page.html',
  styleUrls: ['./horario-modal.page.scss'],
})
export class HorarioModalPage {

  @Input() value: string;

  constructor(private modalController: ModalController) {
   }

   ionViewDidEnter() {
    console.log(this.value);
  }

  async regresar() {
    const result: Date = new Date();

    await this.modalController.dismiss(result);
  }

}
