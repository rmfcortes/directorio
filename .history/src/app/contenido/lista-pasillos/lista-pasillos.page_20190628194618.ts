import { Component, Input, ViewChild } from '@angular/core';
import { PasillosService } from 'src/app/services/pasillos.service';
import { ModalController, IonSlides } from '@ionic/angular';
import { CategoriasPasillo, Producto } from 'src/app/interfaces/negocio.interface';

@Component({
  selector: 'app-lista-pasillos',
  templateUrl: './lista-pasillos.page.html',
  styleUrls: ['./lista-pasillos.page.scss'],
})
export class ListaPasillosPage {

  @Input() data;
  @ViewChild(IonSlides) slide: IonSlides;

  categorias: CategoriasPasillo[];
  subCategoriaSelected = false;
  subCategoria: string;
  id: string;
  pasillo = '';
  productos: Producto[];

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
    speed: 400
  };

  isOpen = false;

  batch = 18;
  lazyBatch = 12;
  lastKey = '';
  noMore = false;
  favs = [];

  constructor(
    private modalCtrl: ModalController,
    private pasilloService: PasillosService
  ) { }

  async ionViewDidEnter() {
    this.slide.lockSwipes(true);
    this.getDatos();
  }

  async getDatos() {
    this.id = this.data.id;
    this.pasillo = this.data.pasillo;
    this.categorias = await this.pasilloService.getCategorias(this.id, this.pasillo);
  }

  display(i) {
    if (!this.categorias[i].display) {
      this.categorias[i].display = true;
      return;
    }
    this.categorias[i].display = false;
  }

  slideToSub(subCategoria) {
    this.subCategoria = subCategoria;
    this.slide.lockSwipes(false);
    this.slide.slideNext();
    this.subCategoriaSelected = true;
    this.slide.lockSwipes(true);
    this.getProductos();
  }

  async getProductos() {
    const prod: Producto[] = await this.pasilloService.getProductos(this.id, this.pasillo, this.subCategoria, this.batch + 1);
    if (prod.length === this.batch + 1) {
      this.lastKey = prod[prod.length - 1].id;
      prod.pop();
    } else {
      this.noMore = true;
    }
    await this.pasilloService.resetLocalProds(this.subCategoria);
    this.productos = await this.pasilloService.updateProductsQty(this.productos);
    return prod;
  }

  regresarCategorias() {
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.subCategoriaSelected = false;
    this.slide.lockSwipes(true);
  }

  regresar() {
    this.modalCtrl.dismiss();
  }


}
