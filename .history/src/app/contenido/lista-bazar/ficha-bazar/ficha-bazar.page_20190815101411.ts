import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { ClasificadosService } from 'src/app/services/clasificados.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MapaPage } from '../../mapa/mapa.page';
import { UidService } from 'src/app/services/uid.service';
import { LoginPage } from '../../login/login.page';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-ficha-bazar',
  templateUrl: './ficha-bazar.page.html',
  styleUrls: ['./ficha-bazar.page.scss'],
})
export class FichaBazarPage implements OnInit, OnDestroy {

  @Input() anuncioPrevData;
  @Input() clasificado;

  articulo: any;
  infoReady: boolean;
  preguntas = [];
  inmueble = false;
  uid: string;

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  noLongerExist = false;

  preguntasSub: Subscription;
  isFavorito = false;

  wantAsk = false;
  watnFav = false;

  constructor(
    private modalController: ModalController,
    public alertController: AlertController,
    private callNumber: CallNumber,
    private bazarService: ClasificadosService,
    private usuarioService: UsuarioService,
    private uidService: UidService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    delete this.anuncioPrevData.url;
    this.getParams();
  }

  async getParams() {
    if (this.clasificado === 'bazar') {
      this.inmueble = false;
    } else if (this.clasificado === 'inmuebles') {
      this.inmueble = true;
    }
    this.getAnuncioBazar();
  }

  async getAnuncioBazar() {
    try {
      const anuncio: any = await this.bazarService.getArticuloBazar(this.inmueble, this.anuncioPrevData.id);
      if (!anuncio) {
        this.noLongerExist = true;
        return;
      }
      this.articulo = {...anuncio, ...this.anuncioPrevData};
      if (anuncio.preguntas > 0) {
        this.preguntasSub = this.bazarService.getPreguntas(this.anuncioPrevData.id).subscribe(preguntas => {
          this.preguntas = preguntas;
          this.preguntas.sort((a, b) => a.fecha - b.fecha);
          console.log(this.preguntas);
        });
      }
      this.uid = this.uidService.getUid();
      if (this.uid) {
        this.getFavorito(this.clasificado);
      }
      this.infoReady = true;
      console.log(this.articulo);
    } catch (error) {
      console.log(error);
    }
  }

  async getFavorito(clasificado) {
    const resp = await this.usuarioService.getFavorito(this.articulo.id, clasificado);
    if (resp) {
      this.isFavorito = true;
    } else {
      this.isFavorito = false;
    }
  }

  async isAuth() {
    if (this.uid) {
      this.preguntaPrompt();
    } else {
      this.wantAsk = true;
      this.presentLogin('pregunta');
    }
  }

  async preguntaPrompt() {
    const alert = await this.alertController.create({
      header: 'Pregunta',
      inputs: [
        {
          name: 'pregunta',
          type: 'text',
          placeholder: 'Haz una pregunta al vendedor'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: (pregunta) => {
            this.publicarPregunta(pregunta);
          }
        }
      ]
    });

    await alert.present();
  }

  async publicarPregunta(comentario) {
    console.log(comentario);
    let pregunta;
    if (this.inmueble) {
      pregunta = {
        fecha: Date.now(),
        idNegocio: this.articulo.id,
        titulo: this.articulo.titulo,
        pregunta: comentario,
        categoria: 'inmuebles',
      };
    } else {
      pregunta = {
        fecha: Date.now(),
        idNegocio: this.articulo.id,
        titulo: this.articulo.titulo,
        pregunta: comentario,
        categoria: 'bazar',
      };
    }
    try {
      // await this.usuarioService.publicarPregunta(pregunta);
      const usuario: any = await this.usuarioService.getUidAndPhoto();
      const p = {
        pregunta: comentario,
        url: usuario.url,
        nombre: usuario.nombre
      };
      this.preguntas.push(p);
      this.wantAsk = false;
    } catch (error) {
      console.log(error);
    }
  }

  llamar() {
    this.callNumber.callNumber(this.articulo.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async muestraMapa() {
    const datos = {
      lat: this.clasificado.lat,
      lng: this.clasificado.lng
    };
    const modal = await this.modalController.create({
      component: MapaPage,
      componentProps: { data: datos }
    });
    return await modal.present();
  }

  async favorito() {
    try {
      if (!this.uid) {
        this.watnFav = true;
        this.presentLogin('favorito');
        return;
      }
      const fav = {
        url: this.articulo.url[0],
        nombre: this.articulo.titulo,
        precio: this.articulo.precio,
        id: this.articulo.id,
        descripcion: this.articulo.descripcion,
        categoria: '',
        subCategoria: '',
      };
      if (this.inmueble) {
        fav.categoria = 'inmuebles';
      } else {
        fav.categoria = 'bazar';
        fav.subCategoria = this.articulo.categoria;
      }
      await this.usuarioService.guardarFavorito(fav);
      this.isFavorito = true;
      this.watnFav = false;
    } catch (error) {
      console.log(error);
    }
  }

  async borrarFavorito() {
    try {
      let clasificado;
      if (this.inmueble) {
        clasificado = 'inmuebles';
      } else {
        clasificado = 'bazar';
      }
      await this.usuarioService.borrarFavorito(this.articulo.id, clasificado);
      this.isFavorito = false;
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
      if (this.uid && this.wantAsk) {
        this.preguntaPrompt();
      }
      if (this.uid && this.watnFav) {
        this.favorito();
      }
    });
    return await modal.present();
  }


  regresar() {
    this.modalController.dismiss(this.isFavorito);
  }

  ngOnDestroy(): void {
    if (this.preguntasSub) { this.preguntasSub.unsubscribe(); }
  }

}
