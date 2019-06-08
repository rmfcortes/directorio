import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ActionSheetController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FichaOfertaPage } from '../ficha-oferta/ficha-oferta.page';
import { OfertasService } from 'src/app/services/ofertas.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: 'ofertas.page.html',
  styleUrls: ['ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('pageTop') pageTop: IonContent;

  ofertasSub: Subscription;
  ofertas = [];
  ofertasFill = [];
  ofertasRespaldo = [];

  sliderConfig = {
    spaceBetween: 0
  };

  paginas = ['Destacadas', 'Por Categoría'];
  categoria = 'Destacados';
  categorias = [];
  categoriaReady = false;
  hasOfertas = false;

  carga = 4;
  y = 0;
  toTop = false;

  constructor(public modalController: ModalController,
              private ofertaService: OfertasService,
              private actionSheetController: ActionSheetController
              ) {}

  async ngOnInit() {
  }

  async ionViewDidEnter() {
    this.getOfertas();
  }

  async getOfertas() {
    const of: any = await this.ofertaService.getOfertas();
    if (of) {
      this.ofertasRespaldo = of;
      this.ofertasFill = this.ofertasRespaldo.filter(oferta => oferta.tipo > 1);
      await this.llenaAnuncios();
      this.hasOfertas = true;
      const cat: any = this.ofertaService.getCatOfertas();
      this.categorias = cat;
      this.categoriaReady = true;
    } else {
      this.hasOfertas = false;
    }
  }

  async segmentChanged(cat) {
    if (cat === 'Destacadas') {
      this.ofertasFill = this.ofertasRespaldo.filter(oferta => oferta.tipo > 1);
      await this.llenaAnuncios();
      return;
    }
    this.presentCategorias();
  }

  async presentCategorias() {
    const buttons = [];
    console.log(this.categorias);
    this.categorias.forEach(categoria => {
      buttons.push({
        text: categoria,
        handler: () => {
          this.ofertasFill = [...this.ofertasRespaldo];
          this.ofertasFill = this.ofertasFill.filter(oferta => oferta.categoria === categoria);
          console.log(this.ofertasFill);
          this.llenaAnuncios();
        }
      });
    });
    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    buttons.unshift({
      text: 'Todas',
      handler: () => {
        this.ofertasFill = [...this.ofertasRespaldo];
        this.llenaAnuncios();
      }
    });
    const actionSheet = await this.actionSheetController.create({
      header: 'Elige una categoría',
      buttons: buttons
    });
    await actionSheet.present();
  }

  async llenaAnuncios() {
    return new Promise((resolve, reject) => {
      this.ofertas = [];
      if ( this.ofertasFill.length < this.carga ) {
        for (let i = 0; i < this.ofertasFill.length; i++ ) {
          this.ofertas.push(this.ofertasFill[i]);
          this.y = i;
        }
        this.infiniteScroll.disabled = true;
        this.toTop = false;
      } else {
        for (let i = 0; i < this.carga; i++ ) {
          this.ofertas.push(this.ofertasFill[i]);
          this.y = i;
        }
        this.infiniteScroll.disabled = false;
      }
      this.ofertas.sort((a, b) => b.tipo - a.tipo );
      console.log(this.ofertas);
      resolve(true);
    });
  }

  loadData(event) {
    this.toTop = true;
    if (this.y + this.carga > this.ofertasFill.length) {
      for (let i = this.carga; i <= this.ofertasFill.length - 1; i++) {
        this.ofertas.push(this.ofertasFill[i]);
        this.y = i;
      }
    } else {
      for (let i = this.carga; i < this.carga * 2; i++) {
        this.ofertas.push(this.ofertasFill[i]);
        this.y = i;
      }
    }
    this.ofertas.sort((a, b) => b.fecha - a.fecha );
    console.log(this.ofertas);
    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.ofertas.length === this.ofertasFill.length) {
      event.target.disabled = true;
    }
  }

  public pageScroller() {
    this.pageTop.scrollToTop();
  }

  async presentModal(oferta) {
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { value: oferta }
    });
    return await modal.present();
  }


}
