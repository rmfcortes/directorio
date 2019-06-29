import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasillosService } from 'src/app/services/pasillos.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lista-pasillos',
  templateUrl: './lista-pasillos.page.html',
  styleUrls: ['./lista-pasillos.page.scss'],
})
export class ListaPasillosPage {

  categorias: any;
  productos: any;
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
    });
  }

  display(i) {
    if (!this.categorias[i].display) {
      this.categorias[i].display = true;
      return;
    }
    this.categorias[i].display = false;
  }

  regresar() {
    this.location.back();
  }


}
