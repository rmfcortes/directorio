import { Component, OnInit, } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { OfertasService } from 'src/app/services/ofertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';

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
  error = false;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private callNumber: CallNumber,
    private alertController: AlertController,
    public toastController: ToastController,
    private ofertaService: OfertasService,
    private usuarioService: UsuarioService,
    private uidService: UidService
    ) { }

    ngOnInit() {
    }

    ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    try {
      this.activedRoute.params.subscribe(async (data) => {
        const id = data['id'];
        this.oferta = await this.ofertaService.getOferta(id);
        console.log(this.oferta);
        if (!this.oferta) {
          this.noLongerExist = true;
          return;
        }
        this.isFavorito();
      });
    } catch (err) {
      this.error = true;
      this.presentAlertError(err);
    }
  }

  async isFavorito() {
    if (!this.oferta.seguidores) {
      this.guardado = false;
      return;
    } else {
      const uid = await this.uidService.getUid();
      const isFavorito = this.oferta.seguidores.filter(seguidor => seguidor === uid);
      if (isFavorito.length > 0) {
        this.guardado = true;
      } else {
        this.guardado = false;
      }
    }
    this.infoReady = true;
  }

  llamar(telefono) {
    this.callNumber.callNumber(telefono, true)
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

  async presentAlert(i) {
    const alert = await this.alertController.create({
      header: this.oferta.nombreNegocio,
      message: `<strong>Dirección:</strong> ${this.oferta.sucursales[i].direccion}<br><br>
                <strong>Teléfono:</strong> ${this.oferta.sucursales[i].telefono}`,
      buttons: ['OK']
    });

    await alert.present();
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

  regresar() {
    this.location.back();
  }

}
