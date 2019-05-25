import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { BazarService } from 'src/app/services/bazar.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-lista-bazar',
  templateUrl: './lista-bazar.page.html',
  styleUrls: ['./lista-bazar.page.scss'],
})
export class ListaBazarPage implements OnInit {

  constructor(private bazarService: BazarService,
              private authService: AuthService,
              private userService: UsuarioService,
              private router: Router,
              public alertController: AlertController) { }

  anuncios = [];
  hasAnuncios = false;
  infoReady = false;

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
      header: '¿Quieres publicar un anuncio?',
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
              this.router.navigate(['/bazar-form/nuevo']);
            } else {
              this.router.navigate(['/login', 'agregar', '/bazar-form/nuevo']);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async getAnunciosUsuario() {
    const anuncios = await this.userService.getAnuncios();
    if (!anuncios) {
      this.router.navigate(['/bazar-form/nuevo']);
      return;
    }
    let anunciosCount = 0;
    Object.values(anuncios).forEach(anuncioId => {
      Object.values(anuncioId).forEach(() => {
        anunciosCount++;
      });
    });
    const cuenta = await this.userService.getCuenta();
    let anunciosPermitidos;
    if (!cuenta) {
      anunciosPermitidos = await this.userService.getAnunciosPermitidos('basica');
    } else {
      anunciosPermitidos = await this.userService.getAnunciosPermitidos(cuenta);
    }
    if (anunciosCount < anunciosPermitidos) {
      this.router.navigate(['/bazar-form/nuevo']);
    } else {
      this.presentFormularioPrompt('Con tu cuenta actual puedes publicar hasta' + anunciosPermitidos + '  anuncios a la vez.' +
      'Si quieres publicar más, puedes llenar el formulario y nos pondremos en contacto contigo.' +
      'O bien puedes borrar algún anuncio para sustituirlo');
    }
  }

  async presentFormularioPrompt(mensaje) {
    const alert = await this.alertController.create({
      header: 'Límite de anuncios alcanzado',
      message: mensaje,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre*'
        },
        {
          name: 'telefono',
          type: 'number',
          placeholder: 'Teléfono*'
        },
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
          text: 'Enviar mis datos',
          handler: (inputs) => {
            if ( inputs.name && inputs.telefono) {
              console.log('Enviar aviso');
            } else {
              this.presentFormularioPrompt('Por favor llena todos los campos');
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
