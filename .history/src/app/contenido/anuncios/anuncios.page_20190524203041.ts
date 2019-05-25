import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  respaldoAnuncios = [];
  categorias = [];
  anunciosCount = 0;
  pagina = 'bazar';

  publicacion: string;

  constructor(public actionSheetController: ActionSheetController,
              public alertController: AlertController,
              private router: Router,
              private activedRoute: ActivatedRoute,
              private userService: UsuarioService,
              private anuncioService: AnunciosService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  getParams() {
    const paramSub = this.activedRoute.params.subscribe(data => {
      paramSub.unsubscribe();
      if (data) {
        this.publicacion = data['publicacion'];
      }
      this.getAnuncios();
    });
  }

  async getAnuncios() {
    const anuncios = await this.userService.getAnuncios();
    if (!anuncios) {
      this.anuncios = [];
      this.respaldoAnuncios = [];
      this.hasAnuncios = false;
      this.infoReady = true;
      return;
    }
    console.log(anuncios);
    this.categorias = Object.keys(anuncios);
    this.anuncios = Object.values(anuncios);
    this.respaldoAnuncios = [...this.anuncios];
    this.anunciosCount = 0;
    this.anuncios.forEach(anuncioId => {
      Object.values(anuncioId).forEach(() => {
        this.anunciosCount++;
      });
    });
    console.log(this.anuncios);
    if (this.publicacion) {
      this.checkPermiso();
      return;
    }
    const i = this.categorias.indexOf('bazar');
    if (i >= 0) {
      this.anuncios = Object.values(this.anuncios[i]);
      this.hasAnuncios = true;
      this.infoReady = true;
    } else {
      this.anuncios = [];
      this.hasAnuncios = false;
      this.infoReady = true;
    }
  }

  async checkPermiso() {
    const cuenta = await this.userService.getCuenta();
    if (!cuenta) {
      const anunciosPermitidos = await this.userService.getAnunciosPermitidos('basica');
      if (this.anunciosCount < anunciosPermitidos) {
        if (this.publicacion) {
          this.router.navigate([this.publicacion]);
        } else {
          this.presentActionSheet();
        }
      } else {
        this.presentFormularioPrompt('Con tu cuenta gratuita puedes publicar hasta 5 anuncios a la vez.' +
        'Si quieres publicar más, puedes llenar el formulario y nos pondremos en contacto contigo.' +
        ' O bien puedes borrar algún anuncio para sustituirlo');
      }
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Categoría',
      buttons: [
        {
          text: 'Ofertas (sólo cuentas premium)',
          icon: 'flame',
          handler: () => {
            console.log('Favorite clicked');
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

  segmentChanged() {
    const i = this.categorias.indexOf(this.pagina);
    if (i >= 0) {
      if ( Object.values(this.respaldoAnuncios[i]).length > 0) {
        this.anuncios = Object.values(this.respaldoAnuncios[i]);
        this.hasAnuncios = true;
      } else {
        this.anuncios = [];
        this.hasAnuncios = false;
      }
    } else {
      this.anuncios = [];
      this.hasAnuncios = false;
    }
  }

  async borrarAnuncio(id, i) {
    try {
      await this.anuncioService.borrarAnuncio(this.pagina, id);
      const index = this.categorias.indexOf(this.pagina);
      this.anuncios.splice(i, 1);
      this.respaldoAnuncios[index] = this.anuncios;
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
