import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, ActionSheetController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { OfertasService } from 'src/app/services/ofertas.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: 'ofertas.page.html',
  styleUrls: ['ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) ionContent: IonContent;

  ofertas = [];
  batch = 8;
  lazyBatch = 2;
  lastKey = '';
  filtroActivo = false;
  categoria = '';

  categorias = [];
  buttons = [];
  categoriaReady = false;
  hasOfertas = false;

  toTop = false;
  noMore = false;

  constructor(public modalController: ModalController,
              private ofertaService: OfertasService,
              private actionSheetController: ActionSheetController
              ) {}

  async ngOnInit() {
  }

  async ionViewDidEnter() {
    this.getCategorias();
  }

  async getCategorias() {
    const cat: any = await this.ofertaService.getCatOfertas();
    if (cat) {
      this.categorias = cat;
      await this.getButtons();
      await this.getOfertas();
      this.categoriaReady = true;
    } else {
      this.hasOfertas = false;
    }
  }

  async getOfertas() {
    return new Promise((resolve, reject) => {
      const s = this.ofertaService.getOfertas(this.batch + 1).valueChanges()
        .subscribe((ofertas: any) => {
          s.unsubscribe();
          if (ofertas) {
            this.lastKey = ofertas[0].key;
            if (ofertas.length === this.batch + 1) {
              ofertas.shift();
            }
            this.ofertas = ofertas.reverse();
            console.log(this.ofertas);
            this.categoriaReady = true;
            this.hasOfertas = true;
            resolve();
          }
          this.hasOfertas = false;
          resolve();
        });
    });
  }

  async getOfertasFiltradas() {
    return new Promise((resolve, reject) => {
      const s = this.ofertaService.getOfertasFiltradas(this.batch + 1, this.categoria).valueChanges()
        .subscribe((ofertas: any) => {
          s.unsubscribe();
          if (ofertas) {
            console.log(ofertas);
            this.lastKey = ofertas[0].key;
            if (ofertas.length === this.batch + 1) {
              ofertas.shift();
            }
            this.ofertas = ofertas.reverse();
            console.log(this.ofertas);
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
          handler: async () => {
            this.filtroActivo = true;
            this.noMore = false;
            this.categoria = categoria;
            await this.ionContent.scrollToTop();
            this.getOfertasFiltradas();
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
        handler: async () => {
          this.filtroActivo = false;
          this.noMore = false;
          await this.ionContent.scrollToTop();
          this.getOfertas();
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
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const s = this.ofertaService.getOfertas(this.lazyBatch + 1, this.lastKey).valueChanges()
      .subscribe((ofertas: any) => {
        s.unsubscribe();
        if (ofertas) {
          this.lastKey = ofertas[0].key;
          if (ofertas.length === this.lazyBatch + 1) {
            ofertas.shift();
          } else {
            this.noMore = true;
          }
          this.ofertas = this.ofertas.concat(ofertas.reverse());
          console.log(this.ofertas);
        }
      });

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  loadDataFiltro(event) {
    this.toTop = true;
    console.log(this.noMore);
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const s = this.ofertaService.getOfertasFiltradas(this.lazyBatch + 1, this.categoria, this.lastKey).valueChanges()
      .subscribe((ofertas: any) => {
        s.unsubscribe();
        if (ofertas) {
          this.lastKey = ofertas[0].key;
          console.log(ofertas);
          console.log(ofertas.length);
          console.log(this.lazyBatch + 1);
          if (ofertas.length === this.lazyBatch + 1) {
            ofertas.shift();
          } else {
            this.noMore = true;
          }
          this.ofertas = this.ofertas.concat(ofertas.reverse());
          console.log(this.ofertas);
        }
      });

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }


  public pageScroller() {
    this.ionContent.scrollToTop(300);
  }

}
