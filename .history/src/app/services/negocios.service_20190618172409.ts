import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(private db: AngularFireDatabase) { }

  getCategoriasNegocios() {
    return new Promise((resolve, reject) => {
      const catOfSub = this.db.object(`solo-lectura/negocios/categorias`).valueChanges().subscribe(categorias => {
        catOfSub.unsubscribe();
        if (categorias) {
          resolve(Object.keys(categorias));
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
