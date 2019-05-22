import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ActionSheetController  } from '@ionic/angular';
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

  constructor(private loadingCtrl: LoadingController,
              public actionSheetController: ActionSheetController,
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
      // const anunciosArray = Object.values(anuncios);
      this.categorias = Object.keys(anuncios);
      this.anuncios = Object.values(anuncios);
      console.log(this.categorias);
      console.log(this.anuncios);
      this.hasAnuncios = true;
      this.loader.dismiss();
    });
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Categoría',
      buttons: [
        {
          text: 'Ofertas (sólo negocios activos)',
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

  borrarAnuncio(id) {

  }

}
