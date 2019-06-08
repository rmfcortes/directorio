import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-horario-modal',
  templateUrl: './horario-modal.page.html',
  styleUrls: ['./horario-modal.page.scss'],
})
export class HorarioModalPage {

  @Input() value: string;
  datos = {
    dia: '',
    activo: true,
    horaApertura: null,
    cierreComida: null,
    corrido: true,
    horaCierre: null,
    reapertura: null,
  };

  constructor(private modalController: ModalController) {
   }

   ionViewDidEnter() {
    this.datos.dia = this.value;
  }

  radioGroupChange(event) {
    if (event === 'true') {
      this.datos.corrido = true;
      return;
    }
    this.datos.corrido = false;
    console.log(this.datos.corrido);
  }

  guardarHorario() {
    console.log(this.datos);
    console.log(this.datos.horaApertura < this.datos.horaCierre);
  }

  async regresar() {
    const result: Date = new Date();

    await this.modalController.dismiss(result);
  }

}
