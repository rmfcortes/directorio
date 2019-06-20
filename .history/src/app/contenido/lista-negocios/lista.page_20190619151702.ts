import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NegociosService } from 'src/app/services/negocios.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit, OnDestroy {


  subCategorias = [];

  categoria = '';
  negocios = [];
  infoReady = false;

  constructor(private activatedRoute: ActivatedRoute,
              private negociosService: NegociosService,
              private location: Location) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activatedRoute.params.subscribe( async (params) => {
      this.categoria = params['categoria'];
      const result: any = await this.negociosService.getSubCategorias();
      this.subCategorias = result;
      this.infoReady = true;
      console.log(this.subCategorias);
    });
  }

  regresar() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }

}
