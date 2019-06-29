import { Component, Input, ViewChild } from '@angular/core';
import { PasillosService } from 'src/app/services/pasillos.service';
import { ModalController, IonSlides } from '@ionic/angular';
import { CategoriasPasillo } from 'src/app/interfaces/negocio.interface';

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
  id: string;
  pasillo = '';

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
    speed: 400
  };

  isOpen = false;

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

  muestraProductos(subCategoria) {
    console.log(subCategoria);
    this.slide.lockSwipes(false);
    this.slide.slideNext();
    this.subCategoriaSelected = true;
    this.slide.lockSwipes(true);
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
