import { Component, OnInit, } from '@angular/core';
import { AlertController, ToastController, LoadingController  } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { OfertasService } from 'src/app/services/ofertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit {

  loader: any;
  oferta: any;
  infoReady = false;
  noLongerExist = false;
  loading = true;
  guardando = false;
  guardado = false;
  error = false;

  public lottieConfig: object;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private callNumber: CallNumber,
    private alertController: AlertController,
    public toastController: ToastController,
    private loadingCtrl: LoadingController,
    private ofertaService: OfertasService,
    private usuarioService: UsuarioService
    ) {
      this.lottieConfig = {
        path: 'assets/animations/2166-dotted-loader.json',
        prerender: false,
        renderer: 'canvas',
        autoplay: true,
        loop: true
      };
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      const id = data['id'];
      this.oferta = await this.ofertaService.getOferta(id);
      console.log(this.oferta);
      if (!this.oferta) {
        await this.espera();
        this.loading = false;
        this.noLongerExist = true;
        return;
      }
      this.isFavorito();
    });
  }

  async espera() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        return;
      }, 800);
    });
  }

  async isFavorito() {
    if (this.noLongerExist) { return; }
    try {
      const resp = await this.usuarioService.getFavorito(this.oferta.id, 'ofertas');
      if (resp) {
        this.guardado = true;
      } else {
        this.guardado = false;
      }
      this.infoReady = true;
    } catch (err) {
      this.error = true;
      this.presentAlertError(err);
    }
  }

  llamar() {
    this.callNumber.callNumber(this.oferta.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async agregarFavorito() {
    this.guardando = true;
    const favorito = {
      titulo: this.oferta.titulo,
      url: this.oferta.foto,
      negocio: this.oferta.negocio,
      id: this.oferta.id,
      categoria: 'ofertas'
    };
    try {
      await this.usuarioService.guardarFavorito(favorito);
      this.guardando = false;
      this.guardado = true;
      this.presentToast('Oferta guardada');
    } catch (error) {
      this.guardando = false;
      this.presentAlertError(error);
    }
  }

  async borrarFavorito() {
    try {
      await this.usuarioService.borrarFavorito(this.oferta.id, 'ofertas');
      this.guardado = false;
      this.presentToast('Oferta borrada');
    } catch (error) {
      console.log(error);
    }
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
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
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     translucent: false,
     spinner: 'crescent',
     cssClass: 'custom-loader-class'
    });
    return await this.loader.present();
  }

  regresar() {
    this.location.back();
  }

}
