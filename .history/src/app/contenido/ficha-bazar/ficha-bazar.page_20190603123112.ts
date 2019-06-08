import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
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

  preguntasSub: Subscription;
  isFavorito = false;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private bazarService: ClasificadosService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      const clasificado = data['clasificado'];
      const id = data['id'];
      if (clasificado === 'bazar') {
        this.inmueble = false;
        const categoria = data['categoria'];
        this.getAnuncioBazar(id, categoria, clasificado);
      } else if (clasificado === 'inmuebles') {
        this.inmueble = true;
        this.getInmueble(id, clasificado);
      }
    });
  }

  async getAnuncioBazar(id, categoria, clasificado) {
    try {
      console.log(categoria);
      const anuncio: any = await this.bazarService.getArticuloBazar(categoria, id);
      this.articulo = anuncio;
      if (anuncio.preguntas > 0) {
        this.preguntasSub = this.bazarService.getPreguntas(id, clasificado).subscribe(preguntas => {
          this.preguntas = preguntas;
          this.preguntas.sort((a, b) => a.fecha - b.fecha);
          console.log(this.preguntas);
        });
      }
      this.getFavorito();
      console.log(this.articulo);
    } catch (error) {
      console.log(error);
    }
  }

  async getInmueble(id, categoria) {
    try {
      const anuncio: any = await this.bazarService.getInmueble(id);
      this.articulo = anuncio;
      if (anuncio.preguntas > 0) {
        this.preguntasSub = this.bazarService.getPreguntas(id, categoria).subscribe(preguntas => {
          this.preguntas = preguntas;
          this.preguntas.sort((a, b) => a.fecha - b.fecha);
          console.log(this.preguntas);
        });
      }
      this.getFavorito();
      console.log(this.articulo);
    } catch (error) {
      console.log(error);
    }
  }

  async getFavorito() {
    const resp = await this.usuarioService.getFavorito(this.articulo.id, 'clasificados');
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
        subCategoria: this.articulo.categoria
      };
    }
    try {
      await this.usuarioService.publicarPregunta(pregunta);
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
      let fav;
      if (this.inmueble) {
        fav = {
          url: this.articulo.url[0],
          titulo: this.articulo.titulo,
          precio: this.articulo.precio,
          id: this.articulo.id,
          categoria: 'inmuebles'
        };
      } else {
        fav = {
          url: this.articulo.url[0],
          titulo: this.articulo.titulo,
          precio: this.articulo.precio,
          id: this.articulo.id,
          categoria: 'inmuebles',
          subCategoria: this.articulo.categoria
        };
      }
      await this.usuarioService.guardarFavorito(this.articulo, 'clasificados');
      this.isFavorito = true;
    } catch (error) {
      console.log(error);
    }
  }

  async borrarFavorito() {
    try {
      await this.usuarioService.borrarFavorito(this.articulo.id);
      this.isFavorito = true;
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
