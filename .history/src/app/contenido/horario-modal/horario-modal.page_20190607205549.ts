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
    horarioValido: false,
    aperturaValida: true,
    cierreValido: true,
    comidaApValida: true,
    comidaCiValido: true
  };

  constructor(private modalController: ModalController) {
   }

   ionViewDidEnter() {
    this.datos.dia = this.value;
  }

  radioGroupChange(event) {
    this.datos.corrido = !this.datos.corrido;
    console.log(this.datos.corrido);
  }

  async regresar() {
    const result: Date = new Date();

    await this.modalController.dismiss(result);
  }

}
