import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
})
export class PreguntasPage implements OnInit {

  infoReady: boolean;
  preguntas = [];
  categorias = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  async getPreguntas() {
    const preguntas: any = await this.usuarioService.getPreguntas();
    if (preguntas) {
      this.preguntas = preguntas;
      this.preguntas.sort((a, b) => a.fecha - b.fecha);
    }
    this.infoReady = true;
    console.log(this.preguntas);
  }

  async presentOpciones(pregunta) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Eliminar',
        icon: 'trash',
        handler: () => {
          this.presentAlertConfirm(pregunta);
        }
      }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
      }]
    });
    await actionSheet.present();
  }

    async borrarPregunta(pregunta) {
    console.log(pregunta);
    try {
      const resp = await this.usuarioService.borrarPregunta(pregunta.id);
      const i = this.preguntas.indexOf(pregunta);
      console.log(i);
      this.preguntas.splice(i, 1);
      if (!resp) {
        this.presentAlertError('');
       }
    } catch (error) {
      this.presentAlertError(error);
    }
  }

  async presentAlertConfirm(pregunta) {
    const alert = await this.alertController.create({
      header: 'Confirma',
      message: `¿Estás seguro de borrar esta pregunta?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.borrarPregunta(pregunta);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertError(error) {
    const alert = await this.alertController.create({
      header: 'Ups, algo salió mal, intenta de nuevo',
      message: error,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }

}
