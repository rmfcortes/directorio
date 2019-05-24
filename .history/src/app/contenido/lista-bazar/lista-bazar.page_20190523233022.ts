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
    const anunSub = this.bazarService.getAnuncios().subscribe((anuncios: any) => {
      anunSub.unsubscribe();
      if (anuncios) {
        this.anuncios = anuncios;
        this.hasAnuncios = true;
        console.log(this.anuncios);
      } else {
        this.anuncios = [];
        this.hasAnuncios = false;
      }
    });
  }

}
