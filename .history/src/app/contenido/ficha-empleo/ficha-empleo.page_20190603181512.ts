import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { ClasificadosService } from 'src/app/services/clasificados.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ficha-empleo',
  templateUrl: './ficha-empleo.page.html',
  styleUrls: ['./ficha-empleo.page.scss'],
})
export class FichaEmpleoPage implements OnInit {

  isFavorito: boolean;
  empleo: any;
  infoReady: boolean;
  noLongerExist = false;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private bazarService: ClasificadosService,
    private usuarioService: UsuarioService,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      const id = data['id'];
      try {
        const anuncio: any = await this.bazarService.getEmpleo(id);
        if (!anuncio) {
          this.noLongerExist = true;
          return;
        }
        this.empleo = anuncio;
        this.esFavorito();
        console.log(this.empleo);
      } catch (error) {
        console.log(error);
      }
    });
  }

  async esFavorito() {
    try {
      const resp = await this.usuarioService.getFavorito(this.empleo.id, 'empleos');
      if (resp) {
        this.isFavorito = true;
      } else {
        this.isFavorito = false;
      }
      this.infoReady = true;
    } catch (err) {
      console.log(err);
    }
  }

  llamar() {
    this.callNumber.callNumber(this.empleo.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async favorito() {
    try {
      const fav = {
        nombre: this.empleo.titulo,
        precio: this.empleo.precio,
        id: this.empleo.id,
        empresa: this.empleo.empresa,
        categoria: 'empleos',
      };
      await this.usuarioService.guardarFavorito(fav);
      this.isFavorito = true;
    } catch (error) {
      console.log(error);
    }
  }

  async borrarFavorito() {
    try {
      await this.usuarioService.borrarFavorito(this.empleo.id, 'empleos');
      this.isFavorito = false;
    } catch (error) {
      console.log(error);
    }
  }

  regresar() {
    this.location.back();
  }

}
