import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AnunciosService } from 'src/app/services/anuncios.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ficha-bazar',
  templateUrl: './ficha-bazar.page.html',
  styleUrls: ['./ficha-bazar.page.scss'],
})
export class FichaBazarPage implements OnInit {

  articulo: any;
  infoReady: boolean;
  preguntas = [];

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private anuncioService: AnunciosService,
    private authService: AuthService,
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
        if (anuncio.hasPreguntas === 'true') {
          // aquí obtenemos las preguntas
        }
        this.infoReady = true;
        console.log(this.articulo);
      } catch (error) {
        console.log(error);
      }
    });
  }

  async isAuth() {
    console.log("isAuth");
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

  publicarPregunta(pregunta) {

  }

  regresar() {
    this.location.back();
  }

}
