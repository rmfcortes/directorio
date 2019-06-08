import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  loader: any;
  infoReady = false;
  favoritos = [];
  categorias = [];
  hasFavoritos = false;
  detalles = false;

  constructor(private loadingCtrl: LoadingController,
              public actionSheetController: ActionSheetController,
              public alertController: AlertController,
              private usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getFavoritos();
  }

  async getFavoritos() {
    const favoritos: any = await this.usuarioService.getFavoritos();
    if (favoritos) {
      console.log(favoritos);
      this.categorias = Object.keys(favoritos);
      this.infoReady = true;
      this.hasFavoritos = true;
    } else {
      this.favoritos = [];
      this.categorias = [];
      this.infoReady = true;
      this.hasFavoritos = false;
    }
  }

  async presentOpciones(negocio) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Ver',
        icon: 'share-alt',
        handler: () => {
          this.goDetalles(negocio);
        }
      }, {
        text: 'Eliminar',
        icon: 'trash',
        handler: () => {
          this.presentAlertConfirm(negocio);
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

  async getListaFavoritos(categoria) {
    const fav: any = await this.usuarioService.getListaFavoritos(categoria);
    this.favoritos = fav;
    this.detalles = true;
  }

  goDetalles(negocio) {
    console.log(negocio);
    if (this.pagina === 'negocios') {
      this.router.navigate(['/lista', negocio.categoria, negocio.id]);
    } else {
      if (negocio.categoria === 'bazar') {
        this.router.navigate(['/ficha-bazar', negocio.categoria, negocio.id, negocio.subCategoria]);
      } else if (negocio.categoria === 'inmuebles') {
        this.router.navigate(['/ficha-bazar', negocio.categoria, negocio.id]);
      } else if (negocio.categoria === 'empleos') {
        this.router.navigate(['/ficha-empleo', negocio.id]);
      }
    }
  }

  // async borrarFavorito(negocio) {
  //   this.presentLoading();
  //   console.log(negocio);
  //   try {
  //     let categoria;
  //     if (this.pagina === 'negocios') {
  //       categoria = 'negocios';
  //     } else {
  //       categoria = 'clasificados';
  //     }
  //     const resp = await this.usuarioService.borrarFavorito(negocio.id, categoria, negocio.categoria);
  //     const i = this.favoritos.indexOf(negocio);
  //     console.log(i);
  //     this.favoritos.splice(i, 1);
  //     this.loader.dismiss();
  //     if (!resp) {
  //       console.log(resp);
  //       this.presentAlertError('');
  //      }
  //   } catch (error) {
  //     this.loader.dismiss();
  //     console.log(error);
  //     this.presentAlertError(error);
  //   }
  // }

  async presentAlertConfirm(comentario) {
    const alert = await this.alertController.create({
      header: 'Confirma',
      message: `Al borrar este negocio, ya no recibirás notificaciones de sus ofertas`,
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
            this.borrarFavorito(comentario);
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
