import { Component, OnInit, } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { OfertasService } from 'src/app/services/ofertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { VariablesService } from 'src/app/services/variables.service';
import { NetworkService } from 'src/app/services/network.service';


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
  uid = '';

  isConnect = true;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private callNumber: CallNumber,
    private alertController: AlertController,
    public toastController: ToastController,
    private ofertaService: OfertasService,
    private usuarioService: UsuarioService,
    private uidService: UidService,
    private networkService: NetworkService,
    private variableService: VariablesService
    ) { }

    ngOnInit() {
    }

    async ionViewDidEnter() {
    this.isConnect = await this.networkService.netStatus;
    console.log(this.isConnect);
    if (!this.isConnect) {
      this.infoReady = true;
      console.log('Offline');
      return;
    }
    this.getParams();
  }

  async getParams() {
    try {
      this.activedRoute.params.subscribe(async (data) => {
        const id = data['id'];
        const favorito = data['favorito'];
        this.uid = await this.uidService.getUid();
        this.oferta = await this.ofertaService.getOferta(id);
        console.log(this.oferta);
        if (!this.oferta) {
          this.noLongerExist = true;
          return;
        }
        if (favorito === 'true' && this.uid) {
          this.guardado = true;
          this.infoReady = true;
          return;
        } else if (favorito === 'buscar' && this.uid) {
          const fav = await this.isFavorito();
          if (fav) {
            this.guardado = true;
            this.infoReady = true;
            return;
          } else {
            this.guardado = false;
          }
        } else {
          this.guardado = false;
        }
        const pendiente = await this.variableService.getSave();
        if (this.uid && pendiente) {
          this.agregarFavorito();
        }
        this.infoReady = true;
      });
    } catch (err) {
      this.error = true;
      this.presentAlertError(err);
    }
  }

  llamar(telefono) {
    this.callNumber.callNumber(telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async agregarFavorito() {
    if (this.guardando) { return; }
    if (!this.uid) {
      this.variableService.setSave(true);
      this.router.navigate(['/login', 'menu', 'favorito']);
      return;
    }
    if (this.guardado) { return; }
    this.guardando = true;
    const favorito = {
      url: this.oferta.foto,
      id: this.oferta.key,
    };
    try {
      await this.usuarioService.guardarOfertaFavorita(this.uid, favorito);
      this.variableService.setSave(false);
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
      await this.usuarioService.borrarOfertaFavorita(this.uid, this.oferta.key);
      this.guardado = false;
      this.presentToast('Oferta borrada');
    } catch (error) {
      console.log(error);
    }
  }

  async isFavorito() {
    const favs = await this.usuarioService.getOfertasFavoritas(this.uid);
    this.guardado = false;
    for (const key of Object.keys(favs)) {
      if (this.oferta.key === key) {
        this.guardado = true;
        break;
      }
    }
    return this.guardado;
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
