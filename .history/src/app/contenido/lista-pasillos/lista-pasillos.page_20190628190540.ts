import { Component, Input } from '@angular/core';
import { PasillosService } from 'src/app/services/pasillos.service';
import { ModalController } from '@ionic/angular';
import { CategoriasPasillo } from 'src/app/interfaces/negocio.interface';

@Component({
  selector: 'app-lista-pasillos',
  templateUrl: './lista-pasillos.page.html',
  styleUrls: ['./lista-pasillos.page.scss'],
})
export class ListaPasillosPage {

  @Input() data;

  categorias: CategoriasPasillo[];
  subCategoriaSelected = false;
  id: string;
  pasillo = '';

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
  };

  constructor(
    private modalCtrl: ModalController,
    private pasilloService: PasillosService
  ) { }

  async ionViewDidEnter() {
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

  regresar() {
    this.modalCtrl.dismiss();
  }


}
