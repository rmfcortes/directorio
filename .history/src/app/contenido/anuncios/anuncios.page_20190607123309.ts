import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AnunciosService } from 'src/app/services/anuncios.service';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {

  infoReady = false;
  hasAnuncios = false;
  anuncios = [];
  pagina = 'negocio';

  constructor(public actionSheetController: ActionSheetController,
              public alertController: AlertController,
              private router: Router,
              private userService: UsuarioService,
              private anuncioService: AnunciosService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getAnuncios();
  }

  async getAnuncios() {
    this.pagina = 'negocio';
    const anuncios: any = await this.userService.getNegocios();
    if (anuncios.length === 0) {
      this.anuncios = [];
      this.hasAnuncios = false;
      this.infoReady = true;
      console.log(this.anuncios);
      console.log(this.hasAnuncios);
      return;
    }
    this.anuncios = anuncios;
    this.hasAnuncios = true;
    this.infoReady = true;
    console.log(this.anuncios);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Categoría',
      buttons: [
        {
          text: 'Ofertas',
          icon: 'flame',
          handler: () => {
            this.router.navigate(['/bazar-form', 'nuevo']);
          }
        }, {
          text: 'Negocio',
          icon: 'cart',
          handler: () => {
            this.router.navigate(['/bazar-form', 'nuevo']);
          }
        }, {
        text: 'Bazar',
        icon: 'cube',
        handler: () => {
          this.router.navigate(['/bazar-form', 'nuevo']);
        }
      }, {
        text: 'Empleos',
        icon: 'briefcase',
        handler: () => {
          this.router.navigate(['/empleos-form', 'nuevo']);
        }
      }, {
        text: 'Inmuebles',
        icon: 'home',
        handler: () => {
          this.router.navigate(['/inmuebles-form', 'nuevo']);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentActionItem(id, i) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            if (this.pagina === 'bazar') {
              this.router.navigate(['/bazar-form', id]);
            } else if (this.pagina === 'empleos') {
              this.router.navigate(['/empleos-form', id]);
            } else if (this.pagina === 'inmuebles') {
              this.router.navigate(['/inmuebles-form', id]);
            }
          }
        }, {
        text: 'Borrar',
        icon: 'trash',
        handler: () => {
          this.borrarAnuncio(id, i);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
    }]
    });
    await actionSheet.present();
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

  segmentChanged(categoria) {
    if (categoria === 'clasificados') {
      this.presentClasificados();
      return;
    }
    if (categoria === 'negocios') {
      this.getAnuncios();
      return;
    }
    if (categoria === 'ofertas') {
      this.getAnuncios();
      return;
    }
  }

  async getOfertas() {
    this.pagina = 'ofertas';
    const anuncios: any = await this.userService.getOfertas();
    if (anuncios.length === 0) {
      this.anuncios = [];
      this.hasAnuncios = false;
      return;
    }
    this.anuncios = anuncios;
    this.hasAnuncios = true;
    console.log(this.anuncios);
  }

  async presentClasificados() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Categoría',
      buttons: [{
        text: 'Bazar',
        icon: 'cube',
        handler: () => {
          this.pagina = 'bazar';
          this.getAnunciosClasificados('bazar');
        }
      }, {
        text: 'Empleos',
        icon: 'briefcase',
        handler: () => {
          this.pagina = 'empleos';
          this.getAnunciosClasificados('empleos');
        }
      }, {
        text: 'Inmuebles',
        icon: 'home',
        handler: () => {
          this.pagina = 'inmuebles';
          this.getAnunciosClasificados('inmuebles');
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async getAnunciosClasificados(categoria) {
    const anuncios: any = await this.userService.getAnunciosCategoria(categoria);
    if (anuncios.length > 0) {
      this.anuncios = anuncios;
      this.hasAnuncios = true;
    } else {
      this.anuncios = [];
      this.hasAnuncios = false;
    }
  }

  async checkPermiso() {
    const cuenta = await this.userService.getCuenta();
    const anunciosPublicados = await this.userService.getAnunciosPublicados();
    console.log(anunciosPublicados);
    let anunciosPermitidos;
    if (!cuenta) {
      anunciosPermitidos = await this.userService.getAnunciosPermitidos('basica');
    } else {
      anunciosPermitidos = await this.userService.getAnunciosPermitidos(cuenta);
    }
    if (anunciosPublicados < anunciosPermitidos) {
      this.presentActionSheet();
    } else {
      this.presentFormularioPrompt('Con tu cuenta actual puedes publicar hasta' + anunciosPermitidos + '  anuncios a la vez.' +
      'Si quieres publicar más, puedes llenar el formulario y nos pondremos en contacto contigo.' +
      'O bien puedes borrar algún anuncio para sustituirlo');
    }
  }

  async borrarAnuncio(id, i) {
    try {
      await this.anuncioService.borrarAnuncio(this.pagina, id);
      this.anuncios.splice(i, 1);
      if (this.anuncios.length === 0) {
        this.hasAnuncios = false;
      } else {
        this.hasAnuncios = true;
      }
    } catch (error) {
      console.log(error);
    }
  }

}
