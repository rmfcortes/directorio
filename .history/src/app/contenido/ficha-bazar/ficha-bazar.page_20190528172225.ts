import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { AnunciosService } from 'src/app/services/anuncios.service';
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

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  preguntasSub: Subscription;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private anuncioService: AnunciosService,
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
      const id = data['id'];
      const categoria = data['categoria'];
      try {
        const anuncio: any = await this.anuncioService.getArticuloBazar(categoria, id);
        this.articulo = anuncio;
        if (anuncio.preguntas > 0) {
          this.preguntasSub = this.anuncioService.getPreguntas(id).subscribe(preguntas => {
            this.preguntas = [];
            preguntas.forEach((pregunta: any) => {
              this.preguntas.push(pregunta.pregunta);
            });
            this.preguntas.sort((a, b) => a.fecha - b.fecha);
          });
        }
        this.infoReady = true;
        console.log(this.articulo);
      } catch (error) {
        console.log(error);
      }
    });
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
    const pregunta = {
      fecha: Date.now(),
      idNegocio: this.articulo.id,
      titulo: this.articulo.titulo,
      pregunta: comentario,
      categoria: 'Bazar',
      subCategoria: this.articulo.categoria
    };
    try {
      await this.usuarioService.publicarPregunta('bazar', pregunta);
      this.preguntas.push(comentario);
    } catch (error) {
      console.log(error);
    }
  }

  llamar() {
    this.callNumber.callNumber(this.articulo.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  regresar() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.preguntasSub) { this.preguntasSub.unsubscribe(); }
  }

}
