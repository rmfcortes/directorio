import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ActionSheetController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OfertasService } from 'src/app/services/ofertas.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: 'ofertas.page.html',
  styleUrls: ['ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('pageTop') pageTop: IonContent;


  ofertas = [];
  batch = 12;
  lastKey = '';
  finished = false;

  ofertasSub: Subscription;
  ofertasQt = 0;
  step = 1;

  ofertasFill = [];
  ofertasRespaldo = [];

  sliderConfig = {
    spaceBetween: 0
  };

  categoria = 'Destacados';
  categorias = [];
  buttons = [];
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
    this.getCantidadOfertas();
  }

  async getCantidadOfertas() {
    const q: any = await this.ofertaService.getCantidadOfertas();
    if (q) {
      this.ofertasQt = q;
      this.getCategorias();
    } else {
      this.ofertasQt = 0;
      this.hasOfertas = false;
    }
  }

  async getCategorias() {
    const cat: any = await this.ofertaService.getCatOfertas();
    this.categorias = cat;
    await this.getButtons();
    await this.getOfertas();
    this.categoriaReady = true;
  }

  async getOfertas() {
    return new Promise((resolve, reject) => {
      const s = this.ofertaService.getOfertas(this.batch + 1).valueChanges()
        .subscribe((ofertas: any) => {
          s.unsubscribe();
          if (ofertas) {
            this.lastKey = ofertas[0].key;
            ofertas.shift();
            this.ofertas = ofertas.reverse();
            console.log(this.ofertas);
            this.step++;
            this.categoriaReady = true;
            this.hasOfertas = true;
            resolve();
          }
          this.hasOfertas = false;
          resolve();
        });
    });
  }

  getButtons() {
    return new Promise((resolve, reject) => {
      this.categorias.forEach(categoria => {
        this.buttons.push({
          text: categoria,
          handler: () => {
            this.ofertasFill = [...this.ofertasRespaldo];
            this.ofertasFill = this.ofertasFill.filter(oferta => oferta.categoria === categoria);
            console.log(this.ofertasFill);
            // this.llenaAnuncios();
          }
        });
      });
      this.buttons.push({
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      });
      this.buttons.unshift({
        text: 'Todas',
        handler: () => {
          this.ofertasFill = [...this.ofertasRespaldo];
          // this.llenaAnuncios();
        }
      });
      resolve(true);
    });
  }

  async presentCategorias() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filtra por categoría',
      buttons: this.buttons
    });
    await actionSheet.present();
  }

  loadData(event) {
    this.toTop = true;

    if (this.ofertas.length === this.ofertasQt) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }

    const s = this.ofertaService.getOfertas(this.batch + 1, this.lastKey).valueChanges()
      .subscribe((ofertas: any) => {
        s.unsubscribe();
        if (ofertas) {
          this.lastKey = ofertas[0].key;
          if (ofertas.length === this.batch + 1) { ofertas.shift(); }
          console.log(ofertas);
          this.ofertas = this.ofertas.concat(ofertas.reverse());
          console.log(this.ofertas);
        }
      });

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.ofertas.length === this.ofertasQt) {
      event.target.disabled = true;
    }
  }

  public pageScroller() {
    this.pageTop.scrollToTop();
  }

}
