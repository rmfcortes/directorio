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
  batch = 4;
  lastKey = '';
  finished = false;

  ofertasSub: Subscription;
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
    this.getOfertas();
  }

  async getOfertas(key?) {
    this.ofertaService.getOfertas(this.batch + 1, this.lastKey).valueChanges()
      .subscribe(ofertas => {
        if (ofertas) {
          ofertas.shift();
          this.ofertas = ofertas.reverse();
          console.log(this.ofertas);
          this.categoriaReady = true;
          this.hasOfertas = true;
        }
        this.hasOfertas = false;
      });
    const cat: any = await this.ofertaService.getCatOfertas();
    this.categorias = cat;
    await this.getButtons();
    this.categoriaReady = true;
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

  async segmentChanged(cat) {
    if (cat === 'Destacadas') {
      this.ofertasFill = this.ofertasRespaldo.filter(oferta => oferta.tipo > 1);
      // await this.llenaAnuncios();
      return;
    }
    this.presentCategorias();
  }

  async presentCategorias() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Elige una categoría',
      buttons: this.buttons
    });
    await actionSheet.present();
  }

  // async llenaAnuncios() {
  //   return new Promise((resolve, reject) => {
  //     this.ofertas = [];
  //     if ( this.ofertasFill.length < this.carga ) {
  //       for (let i = 0; i < this.ofertasFill.length; i++ ) {
  //         this.ofertas.push(this.ofertasFill[i]);
  //         this.y = i;
  //       }
  //       this.infiniteScroll.disabled = true;
  //       this.toTop = false;
  //     } else {
  //       for (let i = 0; i < this.carga; i++ ) {
  //         this.ofertas.push(this.ofertasFill[i]);
  //         this.y = i;
  //       }
  //       this.infiniteScroll.disabled = false;
  //     }
  //     this.ofertas.sort((a, b) => b.tipo - a.tipo );
  //     console.log(this.ofertas);
  //     resolve(true);
  //   });
  // }

  // loadData(event) {
  //   this.toTop = true;
  //   if (this.y + this.carga > this.ofertasFill.length) {
  //     for (let i = this.carga; i <= this.ofertasFill.length - 1; i++) {
  //       this.ofertas.push(this.ofertasFill[i]);
  //       this.y = i;
  //     }
  //   } else {
  //     for (let i = this.carga; i < this.carga * 2; i++) {
  //       this.ofertas.push(this.ofertasFill[i]);
  //       this.y = i;
  //     }
  //   }
  //   this.ofertas.sort((a, b) => b.fecha - a.fecha );
  //   console.log(this.ofertas);
  //   event.target.complete();

  //   // App logic to determine if all data is loaded
  //   // and disable the infinite scroll
  //   if (this.ofertas.length === this.ofertasFill.length) {
  //     event.target.disabled = true;
  //   }
  // }

  public pageScroller() {
    this.pageTop.scrollToTop();
  }

}
