import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  comentarios = [];
  loader: any;
  infoReady = false;

  constructor(public actionSheetController: ActionSheetController,
              private loadingCtrl: LoadingController,
              public alertController: AlertController,
              private router: Router,
              private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getComentarios();
  }

  async getComentarios() {
    const comentarios = await this.usuarioService.getComentarios();
    if (comentarios) {
      this.comentarios = Object.values(comentarios);
      this.comentarios.sort((a, b) => a.fecha - b.fecha);
    }
    this.infoReady = true;
    console.log(this.comentarios);
  }

  async presentOpciones(comentario) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Editar',
        icon: 'create',
        handler: () => {
          this.router.navigate(['/calificar', comentario.id, comentario.puntos]);
        }
      }, {
        text: 'Eliminar',
        icon: 'trash',
        handler: () => {
          this.presentAlertConfirm(comentario);
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

  async borrarComentario(comentario) {
    this.presentLoading();
    console.log(comentario);
    try {
      const resp = await this.usuarioService.borrarComentario(comentario.id);
      const i = this.comentarios.indexOf(comentario);
      console.log(i);
      this.comentarios.splice(i, 1);
      this.loader.dismiss();
      if (!resp) {
        this.presentAlertError('');
       }
    } catch (error) {
      this.loader.dismiss();
      this.presentAlertError(error);
    }
  }

  async presentAlertConfirm(comentario) {
    const alert = await this.alertController.create({
      header: 'Confirma',
      message: `Una vez eliminado el comentario, se perderá la calificación y datos adjuntos. ¿Estás seguro de borrarlo?`,
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
            this.borrarComentario(comentario);
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

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

}
