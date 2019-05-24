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

  ngOnInit() {
    this.getAnuncios();
  }

  getAnuncios() {
    const anunSub = this.bazarService.getAnuncios().subscribe((categorias: any) => {
      anunSub.unsubscribe();
      if (categorias) {
        this.hasAnuncios = true;
        categorias.forEach(anuncio => {
          this.anuncios.push(anuncio);
        });
        console.log(this.anuncios);
      } else {
        this.anuncios = [];
        this.hasAnuncios = false;
      }
    });
  }

}
