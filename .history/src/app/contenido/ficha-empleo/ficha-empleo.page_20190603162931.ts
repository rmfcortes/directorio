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
        this.empleo = anuncio;
        this.infoReady = true;
        console.log(this.empleo);
      } catch (error) {
        console.log(error);
      }
    });
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
        categoria: 'Empleos',
      };
      await this.usuarioService.guardarFavorito(fav);
      this.isFavorito = true;
    } catch (error) {
      console.log(error);
    }
  }

  async borrarFavorito() {
    try {
      await this.usuarioService.borrarFavorito(this.empleo.id, 'Empleos');
      this.isFavorito = false;
    } catch (error) {
      console.log(error);
    }
  }

  regresar() {
    this.location.back();
  }

}
