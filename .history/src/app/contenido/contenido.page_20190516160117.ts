import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriasService } from '../services/categorias.service';
import { Subscription } from 'rxjs';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.page.html',
  styleUrls: ['./contenido.page.scss'],
})
export class ContenidoPage implements OnInit, OnDestroy {

  constructor(private categoriaService: CategoriasService,
              private menuCtrl: MenuController) {  }

  categoriaSub: Subscription;
  categorias = [];

  ngOnInit() {
    this.getCategorias();
  }

  getCategorias() {
    this.categoriaSub = this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = Object.keys(data);
    });
  }

  ngOnDestroy(): void {
    this.categoriaSub.unsubscribe();
  }

  cierraMenu() {
    this.menuCtrl.close('menu');
  }

}
