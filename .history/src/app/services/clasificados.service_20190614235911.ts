import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ClasificadosService {

  constructor(private db: AngularFireDatabase) { }

  // Bazar

  getAnuncios(batch, lastKey?) {
    if (lastKey) {
      return this.db.list('solo-lectura/anuncios/bazar', data =>
        data.orderByKey().limitToLast(batch).endAt(lastKey));
    } else {
      return this.db.list('solo-lectura/anuncios/bazar', data =>
        data.orderByKey().limitToLast(batch));
    }
  }

  getAnunciosFiltrados(batch, categoria, lastKey?) {
    console.log(lastKey);
    console.log(categoria);
    if (lastKey) {
      return this.db.list('solo-lectura/anuncios/bazar', data =>
        data.orderByChild('categoria').startAt(categoria, lastKey).limitToLast(batch));
    } else {
      console.log('No lastKey');
      return this.db.list('solo-lectura/anuncios/bazar', data =>
        data.orderByChild('categoria').equalTo(categoria).limitToLast(batch));
    }
  }

  getCatBazar() {
    return new Promise((resolve, reject) => {
      const bazarSub = this.db.list(`solo-lectura/categoriasBazar`).valueChanges().subscribe(categorias => {
        bazarSub.unsubscribe();
        console.log(categorias);
        if (categorias) {
          resolve(categorias);
        } else {
          resolve(false);
        }
      });
    });
  }

  getArticuloBazar(categoria, id) {
    return new Promise(async (resolve, reject) => {
      const bazarSub =  this.db.object(`/anuncios/bazar/${id}`).valueChanges()
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

  // Inmuebles

  getInmuebles() {
    return this.db.list('anuncios/inmuebles').valueChanges();
  }

  getInmueble(id) {
    return new Promise(async (resolve, reject) => {
      const inmuebleSub =  this.db.object(`/anuncios/inmuebles/${id}`).valueChanges()
        .subscribe(articulo => {
          inmuebleSub.unsubscribe();
          resolve(articulo);
        });
    });
  }

  // Preguntas

  getPreguntas(id, categoria) {
    return this.db.list(`/preguntas/${categoria}/${id}`).valueChanges();
}

}
