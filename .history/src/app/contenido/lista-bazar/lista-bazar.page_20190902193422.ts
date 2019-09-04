import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AlertController, ActionSheetController, IonInfiniteScroll, IonContent, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ClasificadosService } from 'src/app/services/clasificados.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { FichaBazarPage } from './ficha-bazar/ficha-bazar.page';
import { LoginPage } from '../../login/login.page';
import { BazarFormPage } from '../bazar-form/bazar-form.page';
import { InmueblesFormPage } from '../inmuebles-form/inmuebles-form.page';


@Component({
  selector: 'app-lista-bazar',
  templateUrl: './lista-bazar.page.html',
  styleUrls: ['./lista-bazar.page.scss'],
})
export class ListaBazarPage implements OnInit {

  @Input() pagina: string;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) ionContent: IonContent;

  constructor(
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private modalController: ModalController,
    private router: Router,
    private bazarService: ClasificadosService,
    private userService: UsuarioService,
    private uidService: UidService,
  ) { }

  anuncios = [];
  buttons = [];
  batch = 6;
  lazyBatch = 4;
  lastKey = '';
  filtroActivo = false;
  noMore = false;
  categoria = '';

  contactUs = false;

  categorias = [];
  hasAnuncios = false;
  infoReady = false;
  ref: string;
  ruta: any;

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    let refCat;
    if (this.pagina === 'bazar') {
      this.ref = 'solo-lectura/anuncios/bazar';
      refCat = `solo-lectura/anuncios/categorias-bazar`;
      this.ruta = BazarFormPage;
    } else if (this.pagina === 'inmuebles') {
      this.ref = 'solo-lectura/anuncios/inmuebles';
      refCat = `solo-lectura/anuncios/categorias-inmuebles`;
      this.ruta = InmueblesFormPage;
    }
    this.getCategorias(refCat);
  }

  async getCategorias(ref) {
    const cat: any = await this.bazarService.getCatBazar(ref);
    if (cat) {
      this.categorias = cat;
      await this.getButtons();
      this.getAnuncios();
    } else {
      this.hasAnuncios = false;
    }
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
            this.getAnunciosFiltrados();
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
          this.getAnuncios();
        }
      });
      resolve(true);
    });
  }

  getAnuncios() {
    const anunSub = this.bazarService.getAnuncios(this.batch + 1, this.ref).valueChanges()
      .subscribe(async (anuncios: any) => {
        anunSub.unsubscribe();
        if (anuncios.length > 0) {
            this.lastKey = anuncios[0].id;
            if (anuncios.length === this.batch + 1) {
              anuncios.shift();
            } else {
              this.noMore = true;
            }
            this.anuncios = anuncios.reverse();
            this.hasAnuncios = true;
            this.infoReady = true;
            console.log(this.anuncios);
        } else {
          this.infoReady = true;
          this.anuncios = [];
          this.hasAnuncios = false;
        }
      });
  }

  async getAnunciosFiltrados() {
    return new Promise((resolve, reject) => {
      const s = this.bazarService.getAnunciosFiltrados(this.batch + 1, this.categoria, this.ref).valueChanges()
        .subscribe((anuncios: any) => {
          s.unsubscribe();
          if (anuncios) {
            this.lastKey = anuncios[0].id;
            if (anuncios.length === this.batch + 1) {
              anuncios.shift();
            } else {
              this.noMore = true;
            }
            this.anuncios = anuncios.reverse();
            this.hasAnuncios = true;
            return resolve();
          }
          this.hasAnuncios = false;
          resolve();
        });
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
    const s = this.bazarService.getAnuncios(this.lazyBatch + 1, this.ref, this.lastKey).valueChanges()
      .subscribe((anuncios: any) => {
        s.unsubscribe();
        if (anuncios) {
          this.lastKey = anuncios[0].id;
          if (anuncios.length === this.lazyBatch + 1) {
            anuncios.shift();
          } else {
            this.noMore = true;
          }
          this.anuncios = this.anuncios.concat(anuncios.reverse());
          console.log(this.anuncios);
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
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const s = this.bazarService.getAnunciosFiltrados(this.lazyBatch + 1, this.categoria, this.ref, this.lastKey).valueChanges()
      .subscribe((anuncios: any) => {
        s.unsubscribe();
        if (anuncios) {
          this.lastKey = anuncios[0].id;
          if (anuncios.length === this.lazyBatch + 1) {
            anuncios.shift();
          } else {
            this.noMore = true;
          }
          this.anuncios = this.anuncios.concat(anuncios.reverse());
          console.log(this.anuncios);
        }
      });

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  async agregarAnuncio() {
    const user = await this.uidService.getUid();
    if (!user) {
      this.presentLogin();
      return;
    }
    this.getAnunciosUsuario();
  }

  async getAnunciosUsuario() {
    const publicados = await this.userService.getAnunciosPublicados();
    if (!publicados) {
      this.presentForm();
      return;
    }
    let permitidos = await this.userService.getAnunciosPermitidos();
    if (!permitidos) {
      permitidos = 4;
    }
    if (publicados < permitidos) {
      this.presentForm();
    } else {
      this.contactUs = true;
    }
  }

  async presentLogin() {
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { tipo: 'anuncio' }
    });

    modal.onDidDismiss().then(async () => {
      const user = await this.uidService.getUid();
      if (user) {
        this.getAnunciosUsuario();
      }
    });
    return await modal.present();
  }

  async presentForm() {
    const modal = await this.modalController.create({
      component: this.ruta,
      componentProps: { tipo: 'nuevo' }
    });

    modal.onDidDismiss().then(async (resp) => {
      if (resp) {
        // this.anuncios agregar anuncio
      }
    });
    return await modal.present();
  }

  async detallesAnuncio(anuncio) {
    const modal = await this.modalController.create({
      component: FichaBazarPage,
      componentProps: {
        anuncioPrevData: anuncio,
        clasificado: this.pagina
      }
    });
    return await modal.present();
  }

  regresar() {
    this.modalController.dismiss();
  }

}
