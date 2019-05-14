import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriasService } from '../services/categorias.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.page.html',
  styleUrls: ['./contenido.page.scss'],
})
export class ContenidoPage implements OnInit, OnDestroy {

  constructor(private categoriaService: CategoriasService) {  }

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

}
