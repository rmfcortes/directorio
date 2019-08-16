import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { AlertController, ActionSheetController, IonSlides, ModalController, ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { FichaNegocioPage } from '../negocios/ficha-negocio/ficha-negocio.page';
import { FichaOfertaPage } from '../ofertas/ficha-oferta/ficha-oferta.page';
import { VistaPreviaNegocio } from 'src/app/interfaces/negocio.interface';
import { OfertasService } from 'src/app/services/ofertas.service';
import { FichaProductoPage } from '../negocios/ficha-negocio/ficha-producto/ficha-producto.page';
import { FichaBazarPage } from '../lista-bazar/ficha-bazar/ficha-bazar.page';
import { FichaEmpleoPage } from '../lista-empleos/ficha-empleo/ficha-empleo.page';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  @ViewChild(IonSlides) slide: IonSlides;

  uid: string;

  public lottieConfig: object;

  infoReady = false;
  favoritos = [];
  respaldoFavoritos = [];
  categorias = [];
  categoria: string;
  hasFavoritos = false;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
    speed: 400
  };

  constructor(
    public actionSheetController: ActionSheetController,
    private toastController: ToastController,
    public alertController: AlertController,
    private modalController: ModalController,
    private ngZone: NgZone,
    private usuarioService: UsuarioService,
    private ofertService: OfertasService,
    private uidService: UidService,
    ) {
        this.lottieConfig = {
          path: 'assets/animations/favoritos.json',
          renderer: 'canvas',
          autoplay: true,
          loop: false
        };
      }

  ngOnInit() {
    this.slide.lockSwipes(true);
  }

  ionViewDidEnter() {
    this.getFavoritos();
  }

  async getFavoritos() {
    return new Promise(async (resolve, reject) => {
      this.uid = await this.uidService.getUid();
      if (!this.uid) {
        this.noFavoritos();
        return resolve();
      }
      const favoritos: any = await this.usuarioService.getFavoritos();
      if (favoritos) {
        this.categorias = Object.keys(favoritos);
        this.respaldoFavoritos = favoritos;
        this.infoReady = true;
        this.hasFavoritos = true;
        resolve();
      } else {
        this.noFavoritos();
        resolve();
      }
    });
  }

  noFavoritos() {
    this.favoritos = [];
    this.categorias = [];
    this.infoReady = true;
    this.hasFavoritos = false;
  }

  mostrarDetalles() {
    this.slide.lockSwipes(false);
    this.slide.slideNext();
    this.slide.lockSwipes(true);
  }

  regresarCategorias() {
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.slide.lockSwipes(true);
  }

  async getListaFavoritos(categoria) {
    this.categoria = categoria;
    this.favoritos = Object.values(this.respaldoFavoritos[categoria]);
    this.mostrarDetalles();
  }

  async muestraNegocio(negocio) {
    const modal = await this.modalController.create({
      component: FichaNegocioPage,
      componentProps: { infoNegocio: negocio, categoria: negocio.categoria }
    });
    modal.onDidDismiss().then(async () => {
      await this.getFavoritos();
      if (this.respaldoFavoritos[this.categoria]) {
        this.favoritos = Object.values(this.respaldoFavoritos[this.categoria]);
      } else {
        this.favoritos = [];
        if (this.categorias.length === 0) {
          this.hasFavoritos = false;
        }
        this.regresarCategorias();
      }
    });
    return await modal.present();
  }

  async presentOferta(oferta, i) {
    const datos = {
      id: oferta.id,
      favorito: true
    };
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { data: datos }
    });

    modal.onDidDismiss().then(async (respuesta) => {
      if (!respuesta.data.info.favorito) {
        this.deleteFavorito(i, oferta.id);
      }
      if (respuesta.data.showDetail) {
        const negocio: VistaPreviaNegocio =
        await this.ofertService.getInfoNegocio(respuesta.data.showDetail, respuesta.data.info.categoria);
        this.muestraNegocio(negocio);
      }
    });
    return await modal.present();
  }

  async detallesAnuncio(anuncio, i) {
    const modal = await this.modalController.create({
      component: FichaBazarPage,
      componentProps: {
        anuncioPrevData: anuncio,
        clasificado: this.categoria
      }
    });
    modal.onDidDismiss().then(async (resp) => {
      this.favoritos[i].url = resp.data.foto;
      if (!resp.data.fav) {
        this.deleteFavorito(i, anuncio.id);
      }
      console.log(this.favoritos);
    });
    return await modal.present();
  }

  async detallesEmpleo(clasificado, i) {
    const modal = await this.modalController.create({
      component: FichaEmpleoPage,
      componentProps: {
        anuncio: clasificado,
      }
    });
    modal.onDidDismiss().then(async (resp) => {
      if (!resp.data) {
        this.deleteFavorito(i, clasificado.id);
      }
    });
    return await modal.present();
  }

  async muestraProducto(prod, i) {
    prod.guardado = true;
    const modal = await this.modalController.create({
      component: FichaProductoPage,
      componentProps: { producto: prod, id: prod.id, pasillo: prod.pasillo}
    });
    modal.onDidDismiss().then(async () => {
      if (!prod.guardado) {
        this.deleteFavorito(i, prod.id);
      }
    });
    return await modal.present();
  }

  async borrarFavorito(negocio, cat?) {
    if (!cat) {
      cat = negocio.categoria;
    }
    try {
      const resp = await this.usuarioService.borrarFavorito(negocio.id, cat);
      this.ngZone.run(() => {
        const i = this.favoritos.indexOf(negocio);
        this.deleteFavorito(i, negocio.id);
        if (!resp) {
          console.log(resp);
          this.presentAlertError('');
         }
      });
    } catch (error) {
      console.log(error);
      this.presentAlertError(error);
    }
  }

  deleteFavorito(i, id) {
    this.favoritos.splice(i, 1);
    delete this.respaldoFavoritos[this.categoria][id];
    this.presentToast('Elemento eliminado de tus lista de favoritos');
    if (this.favoritos.length === 0) {
      delete this.respaldoFavoritos[this.categoria];
      const y = this.categorias.indexOf(this.categoria);
      this.categorias.splice(y, 1);
      if (this.categorias.length === 0) {
        this.hasFavoritos = false;
      }
      this.regresarCategorias();
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
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
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

}
