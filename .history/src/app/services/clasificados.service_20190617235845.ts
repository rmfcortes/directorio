import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ClasificadosService {

  constructor(private db: AngularFireDatabase) { }

  // Bazar

  getAnuncios(batch, seccion, lastKey?) {
    let ref;
    if (seccion === 'bazar') {
      ref = 'solo-lectura/anuncios/bazar';
    } else {
      ref = `solo-lectura/anuncios/inmuebles`;
    }
    if (lastKey) {
      return this.db.list(ref, data =>
        data.orderByKey().limitToLast(batch).endAt(lastKey));
    } else {
      return this.db.list(ref, data =>
        data.orderByKey().limitToLast(batch));
    }
  }

  getAnunciosFiltrados(batch, categoria, seccion, lastKey?) {
    console.log(lastKey);
    console.log(categoria);
    let ref;
    if (seccion === 'bazar') {
      ref = 'solo-lectura/anuncios/bazar';
    } else {
      ref = `solo-lectura/anuncios/inmuebles`;
    }
    if (lastKey) {
      return this.db.list(ref, data =>
        data.orderByChild('categoria').startAt(categoria, lastKey).limitToLast(batch));
    } else {
      console.log('No lastKey');
      return this.db.list(ref, data =>
        data.orderByChild('categoria').equalTo(categoria).limitToLast(batch));
    }
  }

  getCatBazar(seccion) {
    return new Promise((resolve, reject) => {
      let ref;
      if (seccion === 'bazar') {
        ref = `solo-lectura/anuncios/categorias-bazar`;
      } else {
        ref = `solo-lectura/anuncios/categorias-inmuebles`;
      }
      const bazarSub = this.db.object(ref).valueChanges().subscribe(categorias => {
        bazarSub.unsubscribe();
        console.log(categorias);
        if (categorias) {
          resolve(Object.keys(categorias));
        } else {
          resolve(false);
        }
      });
    });
  }

  getArticuloBazar(seccion, id) {
    return new Promise(async (resolve, reject) => {
      let ref;
      if (!seccion) {
        ref = `solo-lectura/anuncios/bazar-detalles/${id}`;
      } else {
        ref = `solo-lectura/anuncios/inmuebles-detalles/${id}`;
      }
      const bazarSub =  this.db.object(ref).valueChanges()
        .subscribe(articulo => {
          bazarSub.unsubscribe();
          resolve(articulo);
        });
    });
  }

  // Empleos

  getEmpleos() {
    return this.db.list('anuncios/empleos').valueChanges();
  }

  getEmpleo(id) {
    return new Promise(async (resolve, reject) => {
      const empleoSub =  this.db.object(`/anuncios/empleos/${id}`).valueChanges()
        .subscribe(articulo => {
          empleoSub.unsubscribe();
          resolve(articulo);
        });
    });
  }

  // Preguntas

  getPreguntas(id, categoria) {
    return this.db.list(`/preguntas/${categoria}/${id}`).valueChanges();
}

}
