import { Component, OnInit } from '@angular/core';
import { NegociosService } from 'src/app/services/negocios.service';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  categorias = [];
  hasNegocios = false;

  sliderConfig = {
    slidesPerView: 3.3,
    spaceBetween: 10,
    centeredSlides: false
  };

  constructor(private negociosService: NegociosService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getCategorias();
  }

  async getCategorias() {
    const cat: any = await this.negociosService.getCategoriasNegocios();
    if (cat) {
      this.categorias = cat;
    } else {
      this.hasNegocios = false;
    }
  }

  prueba(s) {
    console.log(s);
  }

}
