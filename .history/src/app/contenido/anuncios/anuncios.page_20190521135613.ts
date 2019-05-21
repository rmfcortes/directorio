import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController } from '@ionic/angular';

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

}
