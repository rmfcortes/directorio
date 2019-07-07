import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  ofertas = [];
  infoReady = false;
  hasOfertas = false;

  sliderConfig = {
    slidesPerView: 1,
    autoplay: true,
    centeredSlides: true,
    speed: 400
  };

  constructor(private activatedRoute: ActivatedRoute,
              private negociosService: NegociosService,
              private location: Location,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activatedRoute.params.subscribe( async (params) => {
      this.categoria = params['categoria'];
      console.log(this.categoria);
      const result: any = await this.negociosService.getSubCategorias(this.categoria);
      const ofertas: any = await this.negociosService.getOfertasFiltradas(this.categoria);
      const negocios: any = await this.negociosService.getNegocios(this.categoria);
      console.log(negocios);
      this.negocios = negocios.reverse();
      if (ofertas.length > 0) {
        this.hasOfertas = true;
        this.ofertas = ofertas.reverse();
      } else {
        this.ofertas = [];
        this.hasOfertas = false;
      }
      this.subCategorias = result;
      this.subCategorias.sort((a, b) => a.prioridad - b.prioridad);
      this.infoReady = true;
      console.log(this.subCategorias);
    });
  }

  regresar() {
    this.location.back();
  }

  goDetails(negocio) {
    this.negociosService.setTemporal(negocio);
    this.router.navigate(['/lista', negocio.subCategoria, negocio.id]);
  }

  ngOnDestroy(): void {
  }

}
