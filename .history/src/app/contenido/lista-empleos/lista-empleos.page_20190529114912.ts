import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-empleos',
  templateUrl: './lista-empleos.page.html',
  styleUrls: ['./lista-empleos.page.scss'],
})
export class ListaEmpleosPage implements OnInit {

  infoReady: boolean;
  empleos = [];

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getEmpleos();
  }

  getEmpleos() {
    const anunSub = this.bazarService.getAnuncios().subscribe((categorias: any) => {
      anunSub.unsubscribe();
      if (categorias) {
        this.hasAnuncios = true;
        this.anuncios = [];
        categorias.forEach(anuncios => {
          Object.values(anuncios).forEach(anuncio => {
            this.anuncios.push(anuncio);
          });
        });
        console.log(this.anuncios);
        this.infoReady = true;
      } else {
        this.infoReady = true;
        this.anuncios = [];
        this.hasAnuncios = false;
      }
    });
  }

}
