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

  getCategoriasObject() {
    return new Promise((resolve, reject) => {
      const catSub = this.db.object('solo-lectura/negocios/categorias').valueChanges().subscribe(categorias => {
        catSub.unsubscribe();
        resolve(Object.keys(categorias));
      });
    });
  }

  getsubCategorias(categoria) {
    return new Promise((resolve, reject) => {
      const catSub = this.db.list(`solo-lectura/negocios/${categoria}/subCategorias`).valueChanges().subscribe(categorias => {
        catSub.unsubscribe();
        resolve(categorias);
      });
    });
  }

  getCategoriasBazar() {
    return this.db.object('bazar/categorias').valueChanges();
  }
}
