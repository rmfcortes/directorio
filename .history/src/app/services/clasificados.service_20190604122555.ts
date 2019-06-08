import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ClasificadosService {

  constructor(private db: AngularFireDatabase) { }

  // Bazar

  getAnuncios() {
    return this.db.object('anuncios/bazar').valueChanges();
  }

  async getAnunciosCategoria(categoria) {
    return new Promise(async (resolve, reject) => {
      const bazarSub =  this.db.list(`/anuncios/bazar/${categoria}`).valueChanges()
        .subscribe(articulos => {
          bazarSub.unsubscribe();
          resolve(articulos);
        });
    });
  }

  getArticuloBazar(categoria, id) {
    return new Promise(async (resolve, reject) => {
      const bazarSub =  this.db.object(`/anuncios/bazar/${categoria}/${id}`).valueChanges()
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
