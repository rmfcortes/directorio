import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ActionSheetController  } from '@ionic/angular';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {

  uid: string;
  infoReady = false;
  anuncios = [];
  loader: any;

  constructor(private loadingCtrl: LoadingController,
              public actionSheetController: ActionSheetController,
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
      if (!anuncios) {
        this.infoReady = true;
        this.anuncios = [];
        this.loader.dismiss();
      }
      console.log(anuncios);
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
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
