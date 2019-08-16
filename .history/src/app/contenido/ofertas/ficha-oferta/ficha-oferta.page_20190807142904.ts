import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { OfertasService } from 'src/app/services/ofertas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { NetworkService } from 'src/app/services/network.service';
import { LoginPage } from '../../login/login.page';
import { MapaPage } from '../../mapa/mapa.page';
import { FichaNegocioPage } from '../../negocios/ficha-negocio/ficha-negocio.page';
import { VistaPreviaNegocio } from 'src/app/interfaces/negocio.interface';


@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit {

  @Input() data;

  oferta: any;
  infoReady = false;
  noLongerExist = false;
  guardando = false;
  guardado = false;
  error = false;
  uid = '';

  isConnect = true;

  fueAgregado = false;

  constructor(
    private callNumber: CallNumber,
    private alertController: AlertController,
    public toastController: ToastController,
    private modalController: ModalController,
    private ofertaService: OfertasService,
    private usuarioService: UsuarioService,
    private uidService: UidService,
    private networkService: NetworkService,
    ) { }

    ngOnInit() {
    }

    async ionViewDidEnter() {
    this.isConnect = await this.networkService.netStatus;
    if (!this.isConnect) {
      this.infoReady = true;
      return;
    }
    this.getParams();
  }

  async getParams() {
    try {
      const id = this.data.id;
      const favorito = this.data.favorito;
      this.uid = await this.uidService.getUid();
      this.oferta = await this.ofertaService.getOferta(id);
      console.log(this.oferta);
      console.log(favorito);
      if (!this.oferta) {
        this.infoReady = true;
        this.noLongerExist = true;
        return;
      }
      if (favorito && this.uid) {
        this.guardado = true;
        this.infoReady = true;
        console.log(this.guardado);
        return;
      } else if (favorito === 'buscar' && this.uid) {
        await this.isFavorito();
      } else {
        this.guardado = false;
      }
      this.infoReady = true;
    } catch (err) {
      this.error = true;
      this.presentAlertError(err);
    }
  }

  async isFavorito() {
    const favs: any = await this.usuarioService.getOfertasFavoritas(this.uid);
    if (!favs) {
      this.guardado = false;
      return;
    }
    const exists = favs.find( favorito => favorito.id === this.oferta.key);
    if (exists) {
      this.guardado = true;
    } else {
      this.guardado = false;
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
      this.presentLogin('favorito');
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

  async presentLogin(type) {
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { tipo: type }
    });

    modal.onDidDismiss().then(async () => {
      this.uid = await this.uidService.getUid();
      if (this.uid) {
        this.agregarFavorito();
      }
    });
    return await modal.present();
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

  async muestraMapa(lt, lg) {
    const datos = {
      lat: lt,
      lng: lg
    };
    const modal = await this.modalController.create({
      component: MapaPage,
      componentProps: { data: datos }
    });
    return await modal.present();
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

  regresar(show) {
    const respuesta = {
      key: this.oferta.key,
      favorito: this.guardado
    };
    this.modalController.dismiss({info: respuesta, showDetail: show});
  }

}
