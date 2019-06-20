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
      await this.getNegocios();
    } else {
      this.hasNegocios = false;
    }
  }

  getNegocios() {

  }

}
