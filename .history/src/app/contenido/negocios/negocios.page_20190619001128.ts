import { Component, OnInit } from '@angular/core';
import { NegociosService } from 'src/app/services/negocios.service';
import { OfertasService } from 'src/app/services/ofertas.service';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  categorias = [];
  hasNegocios = false;

  sliderConfig = {
    slidesPerView: 1,
    autoplay: true,
    centeredSlides: true,
    speed: 400
  };

  batch = 10;
  ofertas = [];
  hasOfertas = false;

  infoReady = false;

  constructor(
    private negociosService: NegociosService,
    private ofertaService: OfertasService
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getCategorias();
  }

  async getCategorias() {
    const cat: any = await this.negociosService.getCategoriasNegocios();
    this.categorias = cat;
    this.categorias.sort((a, b) => a.prioridad - b.prioridad);
    console.log(this.categorias);
    await this.getOfertas();
    this.infoReady = true;
  }

  async getOfertas() {
    const s = this.ofertaService.getOfertas(this.batch).valueChanges()
      .subscribe((ofertas: any) => {
        s.unsubscribe();
        if (ofertas) {
          this.ofertas = ofertas.reverse();
          console.log(this.ofertas);
          this.hasOfertas = true;
          return;
        }
        this.hasOfertas = false;
        return;
      });
  }


}
