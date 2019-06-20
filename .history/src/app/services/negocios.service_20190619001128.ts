import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(private db: AngularFireDatabase) { }

  getCategoriasNegocios() {
    return new Promise((resolve, reject) => {
      const catOfSub = this.db.list(`solo-lectura/negocios/categorias-publicadas`).valueChanges().subscribe(categorias => {
        catOfSub.unsubscribe();
        if (categorias) {
          resolve(categorias);
        } else {
          resolve(false);
        }
      });
    });
  }

  getNegocios(categoria) {
    return this.db.list('negocios', data => data.orderByChild('categoria').equalTo(categoria)).valueChanges();
  }

  getNegocio(id) {
    return this.db.object(`negocios/${id}`).valueChanges();
  }

  getValoraciones(id) {
    return this.db.object(`valoraciones/${id}`).valueChanges();
  }
}
