import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ActionSheetController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { ClasificadosService } from 'src/app/services/clasificados.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { VariablesService } from 'src/app/services/variables.service';


@Component({
  selector: 'app-lista-bazar',
  templateUrl: './lista-bazar.page.html',
  styleUrls: ['./lista-bazar.page.scss'],
})
export class ListaBazarPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) ionContent: IonContent;

  constructor(private bazarService: ClasificadosService,
              private userService: UsuarioService,
              private uidService: UidService,
              private variableService: VariablesService,
              private router: Router,
              private activedRoute: ActivatedRoute,
              public alertController: AlertController,
              private actionSheetController: ActionSheetController) { }

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
  ruta: string;
  pagina: string;
  seccion: string;

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      this.pagina = data['clasificados'];
      if (this.pagina === 'bazar') {
        this.ruta = '/bazar-form/nuevo';
        this.seccion = 'bazar';
      } else if (this.pagina === 'inmuebles') {
        this.ruta = '/inmuebles-form/nuevo';
        this.seccion = 'inmuebles';
      }
      this.getCategorias();
    });
  }

  async getCategorias() {
    const cat: any = await this.bazarService.getCatBazar(this.seccion);
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
    const anunSub = this.bazarService.getAnuncios(this.batch + 1).valueChanges()
      .subscribe(async (anuncios: any) => {
        anunSub.unsubscribe();
        if (anuncios) {
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
      const s = this.bazarService.getAnunciosFiltrados(this.batch + 1, this.categoria).valueChanges()
        .subscribe((anuncios: any) => {
          s.unsubscribe();
          if (anuncios) {
            console.log(anuncios);
            this.lastKey = anuncios[0].id;
            if (anuncios.length === this.batch + 1) {
              anuncios.shift();
            } else {
              this.noMore = true;
            }
            this.anuncios = anuncios.reverse();
            console.log(this.anuncios);
            this.hasAnuncios = true;
            resolve();
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
    const s = this.bazarService.getAnuncios(this.lazyBatch + 1, this.lastKey).valueChanges()
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
    const s = this.bazarService.getAnunciosFiltrados(this.lazyBatch + 1, this.categoria, this.lastKey).valueChanges()
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
      this.variableService.setPagina(this.ruta);
      this.router.navigate(['/login', 'anuncio']);
      return;
    }
    this.getAnunciosUsuario();
  }

  async getAnunciosUsuario() {
    const publicados = await this.userService.getAnunciosPublicados();
    if (!publicados) {
      this.router.navigate([this.ruta]);
      return;
    }
    let permitidos = await this.userService.getAnunciosPermitidos();
    if (!permitidos) {
      permitidos = 1;
    }
    if (publicados < permitidos) {
      this.router.navigate([this.ruta]);
    } else {
      this.contactUs = true;
    }
  }

  detallesAnuncio(anuncio) {
    if (this.pagina === 'bazar') {
      this.router.navigate(['/ficha-bazar', 'bazar', anuncio.id, anuncio.categoria]);
    } else if (this.pagina === 'inmuebles') {
      this.router.navigate(['/ficha-bazar', 'inmuebles', anuncio.id]);
    }
  }

}
