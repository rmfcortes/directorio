import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasillosService } from 'src/app/services/pasillos.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.page.html',
  styleUrls: ['./lista-productos.page.scss'],
})
export class ListaProductosPage {

  categorias: any;
  productos: any;
  productosView = {};
  id: string;
  pasillo = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private pasilloService: PasillosService
  ) { }

  async ionViewDidEnter() {
    this.getDatos();
  }

  async getDatos() {
    this.activatedRoute.params.subscribe(async (data) => {
      this.id = data['id'];
      this.pasillo = data['pasillo'];
      this.categorias = await this.pasilloService.getCategorias(this.id, this.pasillo);
      this.productos = await this.pasilloService.getProductos(this.id, this.pasillo);
    });
  }

  display(i) {
    console.log('display' + i);
    if (!this.categorias[i].display) {
      this.categorias[i].display = true;
      console.log(this.categorias);
      return;
    }
    this.categorias[i].display = false;
    console.log(this.categorias);
  }

  scrollTo(categoria) {
    console.log(categoria);
    document.getElementById(categoria).scrollIntoView();
  }

  regresar() {
    this.location.back();
  }

}
