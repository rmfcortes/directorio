import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { ClasificadosService } from 'src/app/services/clasificados.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ficha-bazar',
  templateUrl: './ficha-bazar.page.html',
  styleUrls: ['./ficha-bazar.page.scss'],
})
export class FichaBazarPage implements OnInit, OnDestroy {

  @Input() id;
  @Input() clasificado;

  articulo: any;
  infoReady: boolean;
  preguntas = [];
  inmueble = false;

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  noLongerExist = false;

  preguntasSub: Subscription;
  isFavorito = false;

  constructor(
    private modalController: ModalController,
    public alertController: AlertController,
    private activedRoute: ActivatedRoute,
    private callNumber: CallNumber,
    private location: Location,
    private router: Router,
    private bazarService: ClasificadosService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log(this.id);
    console.log(this.categoria);
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
      const anuncio: any = await this.bazarService.getArticuloBazar(this.inmueble, this.id);
      if (!anuncio) {
        this.noLongerExist = true;
        return;
      }
      this.articulo = anuncio;
      if (anuncio.preguntas > 0) {
        this.preguntasSub = this.bazarService.getPreguntas(this.id).subscribe(preguntas => {
          this.preguntas = preguntas;
          this.preguntas.sort((a, b) => a.fecha - b.fecha);
          console.log(this.preguntas);
        });
      }
      this.getFavorito(this.clasificado);
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
    this.infoReady = true;
  }

  async isAuth() {
    const user = await this.authService.revisa();
    if (user) {
      this.preguntaPrompt();
    } else {
      this.router.navigate(['/login', 'menu']);
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
    } catch (error) {
      console.log(error);
    }
  }

  llamar() {
    this.callNumber.callNumber(this.articulo.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async favorito() {
    try {
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

  regresar() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.preguntasSub) { this.preguntasSub.unsubscribe(); }
  }

}
