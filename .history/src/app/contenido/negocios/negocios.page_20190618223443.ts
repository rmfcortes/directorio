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
    slidesPerView: 1.2,
    spaceBetween: 5,
    centeredSlides: false
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
    console.log(this.categorias);
    await this.getOfertas();
    this.infoReady = true;
  }

  async getOfertas() {
    const s = this.ofertaService.getOfertas(this.batch + 1).valueChanges()
      .subscribe((ofertas: any) => {
        s.unsubscribe();
        if (ofertas) {
          this.ofertas = ofertas.reverse();
          this.hasOfertas = true;
          return;
        }
        this.hasOfertas = false;
        return;
      });
  }

  prueba(s) {
    console.log(s);
  }

}
