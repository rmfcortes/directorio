import { Component, OnInit, NgZone } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
})
export class PreguntasPage implements OnInit {

  infoReady: boolean;
  categorias = [];
  preguntas = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getPreguntas();
  }

  async getPreguntas() {
    const preguntas: any = await this.usuarioService.getPreguntas();
    if (preguntas) {
      this.categorias = Object.keys(preguntas);
      this.preguntas = preguntas;
      // this.preguntas.sort((a, b) => a.fecha - b.fecha);
    }
    this.infoReady = true;
    console.log(this.categorias);
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
      if (!resp) {
        this.presentAlertError('');
       } else {
        this.ngZone.run(() => {
          this.getPreguntas();
        });
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
