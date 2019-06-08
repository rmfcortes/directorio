import { Component, Input } from '@angular/core';
import { ModalController, ToastController  } from '@ionic/angular';

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

  constructor(
    private modalController: ModalController,
    public toastController: ToastController) {
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
    if (!this.datos.horaApertura || !this.datos.horaCierre) {
      this.presentToast('Los campos de hora de Apertura y Cierre son obligatorios');
      return;
    }
    if (this.datos.horaApertura > this.datos.horaCierre) {
      this.presentToast('La hora de Apertura no puede ser más tarde que la hora de Cierre');
      return;
    }
    if (!this.datos.corrido) {
      if (!this.datos.cierreComida || !this.datos.reapertura) {
        this.presentToast('Si el horario no es corrido. La hora de cierre y reapertura para descanso son obligatorios');
        return;
      }
      if (this.datos.cierreComida > this.datos.reapertura) {
        this.presentToast('La hora de Cierre de descanso no puede ser más tarde que la hora de Reapertura');
        return;
      }
      if (this.datos.cierreComida > this.datos.horaCierre ||
          this.datos.reapertura < this.datos.horaApertura ||
          this.datos.reapertura > this.datos.horaCierre ||
          this.datos.cierreComida < this.datos.horaApertura) {
        this.presentToast('El horario de descanso debe estar dentro del horario de Apertura y Cierre');
        return;
      }
    }

  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      header: 'Datos inválidos',
      message: msg,
      position: 'bottom',
      buttons: [ {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async regresar() {
    const result: Date = new Date();

    await this.modalController.dismiss(result);
  }

}
