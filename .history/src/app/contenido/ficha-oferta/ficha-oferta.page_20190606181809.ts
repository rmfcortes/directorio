import { Component, OnInit, } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { OfertasService } from 'src/app/services/ofertas.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit {

  oferta: any;
  infoReady = false;
  noLongerExist = false;
  guardando = false;
  guardado = false;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private callNumber: CallNumber,
    private alertController: AlertController,
    private ofertaService: OfertasService,
    private usuarioService: UsuarioService
    ) { }

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
        this.noLongerExist = true;
      }
      this.isFavorito();
    });
  }

  async isFavorito() {
    try {
      const resp = await this.usuarioService.getFavorito(this.oferta.id, 'ofertas');
      if (resp) {
        this.guardado = true;
      } else {
        this.guardado = false;
      }
      this.infoReady = true;
    } catch (err) {
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
      url: this.oferta.url,
      negocio: this.oferta.negocio,
      id: this.oferta.id,
      categoria: 'ofertas'
    };
    try {
      await this.usuarioService.guardarFavorito(favorito);
      this.guardando = false;
      this.guardado = true;
    } catch (error) {
      this.guardando = false;
      this.presentAlertError(error);
    }
  }

  async borrarFavorito() {
    try {
      await this.usuarioService.borrarFavorito(this.oferta.id, 'ofertas');
      this.guardado = false;
    } catch (error) {
      console.log(error);
    }
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

  regresar() {
    this.location.back();
  }

}
