import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ClasificadosService } from 'src/app/services/clasificados.service';

@Component({
  selector: 'app-ficha-empleo',
  templateUrl: './ficha-empleo.page.html',
  styleUrls: ['./ficha-empleo.page.scss'],
})
export class FichaEmpleoPage implements OnInit {

  empleo: any;
  infoReady: boolean;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private bazarService: ClasificadosService,
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

  regresar() {
    this.location.back();
  }

}
