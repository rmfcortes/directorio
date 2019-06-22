import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasillosService } from 'src/app/services/pasillos.service';
import { Location } from '@angular/common';
import { UidService } from 'src/app/services/uid.service';
import { VariablesService } from 'src/app/services/variables.service';

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
    private router: Router,
    private pasilloService: PasillosService,
    private uidService: UidService,
    private variableService: VariablesService
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
      const prod: any = await this.pasilloService.getProductos(this.id, this.pasillo, this.categoria, this.batch + 1);
      if (prod.length === this.batch + 1) {
        this.lastKey = prod[prod.length - 1].id;
        prod.pop();
      } else {
        this.noMore = true;
      }
      this.productos = prod;
      console.log(this.productos);
    });
  }

    async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    let prod: any = await this.pasilloService.getProductos(this.id, this.pasillo, this.categoria, this.lazyBatch + 1, this.lastKey);

    if (prod) {
      if (prod.length === this.lazyBatch + 1) {
        this.lastKey = prod[prod.length - 1].id;
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

  async agregarFavorito(i) {
    if (this.productos[i].guardando) { return; }
    if (!this.uid) {
      this.variableService.setSave(true);
      this.variableService.setIndex(i);
      this.router.navigate(['/login', 'menu', 'favorito']);
      return;
    }
    if (this.productos[i].guardado) { return; }
    this.productos[i].guardando = true;
    const favorito = {
      url: this.productos[i].url,
      id: this.productos[i].id,
      nombre: this.productos[i].nombre,
      precio: this.productos[i].precio,
      unidad: this.productos[i].unidad,
    };
    try {
      console.log(favorito);
      await this.pasilloService.guardarProductoFavorito(this.uid, favorito);
      this.variableService.setSave(false);
      this.variableService.setIndex(null);
      this.ofertas[i].guardando = false;
      this.ofertas[i].guardado = true;
      this.presentToast('Oferta guardada');
    } catch (error) {
      this.ofertas[i].guardando = false;
      this.presentAlertError(error);
    }
  }

  regresar() {
    this.location.back();
  }

}
