import { Component, OnInit } from '@angular/core';
import { BazarService } from 'src/app/services/bazar.service';

@Component({
  selector: 'app-lista-bazar',
  templateUrl: './lista-bazar.page.html',
  styleUrls: ['./lista-bazar.page.scss'],
})
export class ListaBazarPage implements OnInit {

  constructor(private bazarService: BazarService) { }

  anuncios = [];
  hasAnuncios = false;
  infoReady = false;

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getAnuncios();
  }

  getAnuncios() {
    const anunSub = this.bazarService.getAnuncios().subscribe((categorias: any) => {
      anunSub.unsubscribe();
      if (categorias) {
        this.hasAnuncios = true;
        categorias.forEach(anuncios => {
          Object.values(anuncios).forEach(anuncio => {
            this.anuncios.push(anuncio);
          });
        });
        console.log(this.anuncios);
        setTimeout(() => {
          this.infoReady = true;
        }, 800);
      } else {
        this.infoReady = true;
        this.anuncios = [];
        this.hasAnuncios = false;
      }
    });
  }

}
