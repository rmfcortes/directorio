import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { ClasificadosService } from 'src/app/services/clasificados.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-lista-bazar',
  templateUrl: './lista-bazar.page.html',
  styleUrls: ['./lista-bazar.page.scss'],
})
export class ListaBazarPage implements OnInit {

  constructor(private bazarService: ClasificadosService,
              private authService: AuthService,
              private userService: UsuarioService,
              private router: Router,
              private activedRoute: ActivatedRoute,
              public alertController: AlertController,
              private actionSheetController: ActionSheetController) { }

  anuncios = [];
  anunciosRespaldo = [];
  categorias = [];
  hasAnuncios = false;
  infoReady = false;
  ruta: string;
  pagina: string;
  y = 0;

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      this.pagina = data['clasificados'];
      if (this.pagina === 'bazar') {
        this.ruta = '/bazar-form/nuevo';
        this.getAnuncios();
      } else if (this.pagina === 'inmuebles') {
        this.ruta = '/inmuebles-form/nuevo';
        this.getInmuebles();
      }
    });
  }

  getAnuncios() {
    const anunSub = this.bazarService.getAnuncios().subscribe(async (anuncios: any) => {
      anunSub.unsubscribe();
      if (anuncios) {
        this.hasAnuncios = true;
        this.anunciosRespaldo = anuncios;
        for (let i = 0; i < 6; i++ ) {
          this.anuncios.push(this.anunciosRespaldo[i]);
          this.y = i;
          console.log(this.y);
        }
        this.anuncios.sort((a, b) => b.fecha - a.fecha );
        const cat: any = await this.bazarService.getCategoriasBazar();
        this.categorias = cat;
        console.log(this.anuncios);
        this.infoReady = true;
      } else {
        this.infoReady = true;
        this.anuncios = [];
        this.hasAnuncios = false;
      }
    });
  }

  getInmuebles() {
    const anunSub = this.bazarService.getInmuebles().subscribe((inmuebles: any) => {
      anunSub.unsubscribe();
      if (inmuebles) {
        this.hasAnuncios = true;
        this.anuncios = inmuebles;
        console.log(this.anuncios);
        this.infoReady = true;
      } else {
        this.infoReady = true;
        this.anuncios = [];
        this.hasAnuncios = false;
      }
    });
  }

  async presentCategorias() {
    const buttons = [];
    this.categorias.forEach(categoria => {
      buttons.push({
        text: categoria,
        handler: () => {
          this.anuncios = [...this.anunciosRespaldo];
          this.anuncios = this.anuncios.filter(anuncio => anuncio.categoria === categoria);
        }
      });
    });
    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    buttons.unshift({
      text: 'Todas',
      handler: () => {
        this.anuncios = [...this.anunciosRespaldo];
      }
    });
    const actionSheet = await this.actionSheetController.create({
      header: 'Elige una categoría',
      buttons: buttons
    });
    await actionSheet.present();
  }

  loadData(event) {
    console.log('Done');
    for (let i = this.y + 1; i < this.y + 6; i++) {
      this.anuncios.push(this.anunciosRespaldo[i]);
      console.log(this.y);
    }
    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.anuncios.length === this.anunciosRespaldo.length) {
      event.target.disabled = true;
    }
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
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            if (user) {
              this.getAnunciosUsuario();
            } else {
              this.router.navigate(['/login', 'menu']);
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
      this.router.navigate([this.ruta]);
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
      this.router.navigate([this.ruta]);
    } else {
      this.presentFormularioPrompt('Con tu cuenta actual puedes publicar hasta ' + anunciosPermitidos + '  anuncios a la vez.' +
      ' Si quieres publicar más, puedes llenar el formulario y nos pondremos en contacto contigo.' +
      ' O bien puedes borrar algún anuncio para sustituirlo');
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

  detallesAnuncio(anuncio) {
    if (this.pagina === 'bazar') {
      this.router.navigate(['/ficha-bazar', 'bazar', anuncio.id, anuncio.categoria]);
    } else if (this.pagina === 'inmuebles') {
      this.router.navigate(['/ficha-bazar', 'inmuebles', anuncio.id]);
    }
  }

}
