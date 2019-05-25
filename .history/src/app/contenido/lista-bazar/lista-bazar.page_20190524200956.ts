import { Component, OnInit } from '@angular/core';
import { BazarService } from 'src/app/services/bazar.service';
import { AlertController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lista-bazar',
  templateUrl: './lista-bazar.page.html',
  styleUrls: ['./lista-bazar.page.scss'],
})
export class ListaBazarPage implements OnInit {

  constructor(private bazarService: BazarService,
              private authService: AuthService,
              private router: Router,
              public alertController: AlertController) { }

  anuncios = [];
  hasAnuncios = false;
  infoReady = false;
  anunciosCount = 0;

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getAnuncios();
  }

  getAnuncios() {
    const anunSub = this.bazarService.getAnuncios().subscribe((categorias: any) => {
      anunSub.unsubscribe();
      if (categorias) {
        this.hasAnuncios = true;
        categorias.forEach(anuncios => {
          Object.values(anuncios).forEach(anuncio => {
            this.anuncios.push(anuncio);
          });
        });
        console.log(this.anuncios);
        this.infoReady = true;
      } else {
        this.infoReady = true;
        this.anuncios = [];
        this.hasAnuncios = false;
      }
    });
  }

  async presentAlertConfirm() {
    const user = await this.authService.revisa();
    let msg;
    if (user) {
      msg = 'Te redigiremos a Mis Anuncios para que puedas publicarlo';
    } else {
      msg = 'Necesitas tener una cuenta para publicar anuncios, es muy sencillo crearla, te redigiremos a la página de ingreso';
    }
    const alert = await this.alertController.create({
      header: '¿Quieres publicar un artículo o servicio?',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            if (user) {
              this.router.navigate(['/anuncios']);
            } else {
              this.router.navigate(['/login', 'menu']);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
