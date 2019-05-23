import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  loader: any;
  infoReady = false;
  favoritos = [];

  constructor(private location: Location,
              private loadingCtrl: LoadingController,
              private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getFavoritos();
  }

  async getFavoritos() {
    const favoritos = await this.usuarioService.getFavoritos();
    if (favoritos) {
      console.log(favoritos);
      this.favoritos = favoritos;
      this.infoReady = true;
    } else {
      this.favoritos = [];
      this.infoReady = true;
    }
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

  regresar() {
    this.location.back();
  }

}
