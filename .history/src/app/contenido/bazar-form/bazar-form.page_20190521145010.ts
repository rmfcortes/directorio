import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-bazar-form',
  templateUrl: './bazar-form.page.html',
  styleUrls: ['./bazar-form.page.scss'],
})
export class BazarFormPage implements OnInit {

  categorias: any;
  categoria = '';

  constructor(private location: Location,
              private categoriaService: CategoriasService) { }

  ngOnInit() {
    this.getCategoriasBazar();
  }

  getCategoriasBazar() {
    const catSub = this.categoriaService.getCategoriasBazar().subscribe(cat => {
      catSub.unsubscribe();
      this.categorias = Object.keys(cat);
    });
  }

  regresar() {
    this.location.back();
  }

}
