import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasillosService } from 'src/app/services/pasillos.service';
import { Location } from '@angular/common';
import { UidService } from 'src/app/services/uid.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.page.html',
  styleUrls: ['./lista-productos.page.scss'],
})
export class ListaProductosPage {

  productos: any;
  id: string;
  categoria = '';
  pasillo = '';
  uid = '';

  batch = 18;
  lazyBatch = 12;
  lastKey = '';
  noMore = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private pasilloService: PasillosService,
    private uidService: UidService
  ) { }

  async ionViewDidEnter() {
    this.getDatos();
  }

  async getDatos() {
    this.activatedRoute.params.subscribe(async (data) => {
      this.noMore = false;
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.pasillo = data['pasillo'];
      this.uid = await this.uidService.getUid();
      let prod: any = await this.pasilloService.getProductos(this.id, this.pasillo, this.categoria, this.batch + 1);
      if (prod.length === this.batch + 1) {
        this.lastKey = prod[prod.length - 1].key;
        prod.pop();
      } else {
        this.noMore = true;
      }
      this.productos = prod;
      console.log(this.productos);
    });
  }

    loadData(event) {
    console.log(this.noMore);
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    let prod: any = this.pasilloService.getProductos(this.id, this.pasillo, this.categoria, this.lazyBatch + 1, this.lastKey);
    console.log(prod);
    if (prod) {
      if (prod.length === this.lazyBatch + 1) {
        this.lastKey = prod[prod.length - 1].key;
        prod.pop();
      } else {
        this.noMore = true;
      }
      if (this.uid) {
        // const ofer: any = await this.isFavoritoLoad(ofertas);
        this.productos = this.productos.concat(prod);
      } else {
        this.productos = this.productos.concat(prod);
      }
    }

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  agregarFavorito(i) {
    const favorito = this.productos[i];

  }

  regresar() {
    this.location.back();
  }

}
