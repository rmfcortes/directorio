import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private db: AngularFireDatabase) { }

  getCategorias() {
    return this.db.list('categorias').valueChanges();
  }

  getCategoriasBazar() {
    return this.db.object('bazar/categorias').valueChanges();
  }
}
