import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ClasificadosService {

  constructor(private db: AngularFireDatabase) { }

  getAnuncios() {
    return this.db.object('anuncios/bazar').valueChanges();
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

  getPreguntas(id, categoria) {
    return this.db.list(`/preguntas/${categoria}/${id}`).valueChanges();
}

}
