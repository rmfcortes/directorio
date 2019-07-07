import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ActionSheetController, IonInfiniteScroll, IonContent, ToastController, AlertController } from '@ionic/angular';
import { OfertasService } from 'src/app/services/ofertas.service';
import { Location } from '@angular/common';
import { UidService } from 'src/app/services/uid.service';
import { VariablesService } from 'src/app/services/variables.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FichaOfertaPage } from './ficha-oferta/ficha-oferta.page';

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

  uid = '';
  favs: any;

  constructor(public modalController: ModalController,
              private ofertaService: OfertasService,
              private uidService: UidService,
              private variableService: VariablesService,
              private usuarioService: UsuarioService,
              private actionSheetController: ActionSheetController,
              private toastController: ToastController,
              private alertController: AlertController,
              private location: Location,
              private router: Router,
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
      this.uid = await this.uidService.getUid();
      if (this.uid) {
        const pendiente = await this.variableService.getSave();
        if (pendiente) {
          const i = await this.variableService.getIndex();
          console.log(i);
          this.agregarFavorito(i);
        }
        if (this.hasOfertas) {
          await this.isFavorito();
        }
      }
      console.log(this.ofertas);
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
            } else {
              this.noMore = true;
            }
            this.ofertas = ofertas.reverse();
            this.hasOfertas = true;
            return resolve();
          }
          this.hasOfertas = false;
          return resolve();
        });
    });
  }

  async getOfertasFiltradas() {
    return new Promise((resolve, reject) => {
      const s = this.ofertaService.getOfertasFiltradas(this.batch + 1, this.categoria).valueChanges()
        .subscribe((ofertas: any) => {
          console.log(ofertas);
          s.unsubscribe();
          if (ofertas.length) {
            this.lastKey = ofertas[0].key;
            if (ofertas.length === this.batch + 1) {
              ofertas.shift();
            } else {
              this.noMore = true;
            }
            this.ofertas = ofertas.reverse();
            this.hasOfertas = true;
            resolve();
            return;
          }
          this.hasOfertas = false;
          resolve();
          return;
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
            await this.getOfertasFiltradas();
            if (this.hasOfertas) {
              await this.isFavorito();
            }
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
          await this.getOfertas();
          if (this.hasOfertas) {
            await this.isFavorito();
          }
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
      .subscribe(async (ofertas: any) => {
        s.unsubscribe();
        if (ofertas) {
          this.lastKey = ofertas[0].key;
          if (ofertas.length === this.lazyBatch + 1) {
            ofertas.shift();
          } else {
            this.noMore = true;
          }
          if (this.uid) {
            const ofer: any = await this.isFavoritoLoad(ofertas);
            this.ofertas = this.ofertas.concat(ofer.reverse());
          } else {
            this.ofertas = this.ofertas.concat(ofertas.reverse());
          }
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

  async isFavorito() {
    const favs = await this.usuarioService.getOfertasFavoritas(this.uid);
    this.favs = Object.keys(favs);
    this.ofertas.forEach(async (oferta, i) => {
      oferta.guardado = false;
      for (const key of this.favs) {
        if (oferta.key === key) {
          oferta.guardado = true;
          break;
        }
      }
    });
    return;
  }

  async isFavoritoLoad(ofertas) {
    ofertas.forEach(async (oferta, i) => {
      oferta.guardado = false;
      for (const key of this.favs) {
        if (oferta.key === key) {
          oferta.guardado = true;
          break;
        }
      }
    });
    return ofertas;
  }

  async agregarFavorito(i) {
    if (this.ofertas[i].guardando) { return; }
    if (!this.uid) {
      this.variableService.setSave(true);
      this.variableService.setIndex(i);
      this.router.navigate(['/login', 'menu', 'favorito']);
      return;
    }
    if (this.ofertas[i].guardado) { return; }
    this.ofertas[i].guardando = true;
    const favorito = {
      url: this.ofertas[i].url,
      id: this.ofertas[i].key,
    };
    try {
      console.log(favorito);
      await this.usuarioService.guardarOfertaFavorita(this.uid, favorito);
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

  async borrarFavorito(i) {
    try {
      await this.usuarioService.borrarOfertaFavorita(this.uid, this.ofertas[i].key);
      this.ofertas[i].guardado = false;
      this.presentToast('Oferta borrada');
    } catch (error) {
      console.log(error);
    }
  }

  async presentOferta(key, isFavorito) {
    const datos = {
      id: key,
      favorito: isFavorito
    }
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { data: datos }
    });

    modal.onDidDismiss().then(async (data) => {
      const i = this.ofertas.findIndex(oferta => oferta.key === data.data.key);
      this.ofertas[i].guardado = data.data.favorito;
    });
    return await modal.present();
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async presentAlertError(error) {
    const alert = await this.alertController.create({
      header: 'Ups, algo salió mal, intenta de nuevo',
      message: error,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }


  public pageScroller() {
    this.ionContent.scrollToTop(300);
  }

  regresar() {
    this.location.back();
  }

}