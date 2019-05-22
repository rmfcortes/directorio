import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ActionSheetController, AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {

  uid: string;
  infoReady = false;
  hasAnuncios = false;
  anuncios = [];
  categorias = [];
  loader: any;
  anunciosCount = 0;

  constructor(private loadingCtrl: LoadingController,
              public actionSheetController: ActionSheetController,
              public alertController: AlertController,
              private router: Router,
              private authService: AuthService,
              private userService: UsuarioService) { }

  async ngOnInit() {
    await this.presentLoading();
    this.getUsuario();
  }

  getUsuario() {
    const userSub = this.authService.revisaSub().subscribe(user => {
      this.uid = user.uid;
      userSub.unsubscribe();
      this.getAnuncios();
      console.log(this.uid);
    });
  }

  getAnuncios() {
    const anunciosSub = this.userService.getAnuncios(this.uid).subscribe(anuncios => {
      anunciosSub.unsubscribe();
      this.infoReady = true;
      if (!anuncios) {
        this.anuncios = [];
        this.hasAnuncios = false;
        this.loader.dismiss();
        return;
      }
      this.categorias = Object.keys(anuncios);
      this.anuncios = Object.values(anuncios);
      this.anunciosCount = 0;
      this.anuncios.forEach(anuncioId => {
        Object.values(anuncioId).forEach(anuncio => {
          this.anunciosCount++;
        });
      });
      this.hasAnuncios = true;
      this.loader.dismiss();
    });
  }

  async checkPermiso() {
    const cuentaSub = this.userService.getCuenta(this.uid).subscribe(async (cuenta: any) => {
      cuentaSub.unsubscribe();
      if (!cuenta) {
        const anunciosPermitidos = await this.userService.getAnunciosPermitidos('basica');
        if (this.anunciosCount < anunciosPermitidos) {
          this.presentActionSheet();
          return;
        } else {

        }
      }
    });
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
          console.log('Share clicked');
        }
      }, {
        text: 'Inmuebles',
        icon: 'home',
        handler: () => {
          console.log('Play clicked');
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

  async presentActionItem(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.router.navigate(['/bazar-form', id]);
          }
        }, {
        text: 'Borrar',
        icon: 'trash',
        handler: () => {
          this.borrarAnuncio(id);
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

  async presentFormularioPrompt() {
    const alert = await this.alertController.create({
      header: 'Límite de anuncios alcanzado',
      message: 'Con tu cuenta gratuita puedes publicar 5 anuncios a la vez.' +
      'Si quieres publicar más, puedes llenar el formulario y nos pondremos en contacto contigo.' +
      ' O bien puedes borrar algún anuncio para sustituirlo',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'telefono',
          type: 'number',
          placeholder: 'Teléfono'
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
          handler: () => {
            console.log(name);
            // console.log(telefono);
          }
        }
      ]
    });

    await alert.present();
  }


  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

  borrarAnuncio(id) {

  }

}
