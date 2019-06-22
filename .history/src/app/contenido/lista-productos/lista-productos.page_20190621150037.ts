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

  productos: any;
  id: string;
  categoria = '';

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
      this.categoria = data['categoria'];
      this.pasillo = data['pasillo'];
      this.productos = await this.pasilloService.getProductos(this.id, this.pasillo, this.categoria);
      console.log(this.productos);
    });
  }

  regresar() {
    this.location.back();
  }

}
