import { Injectable } from '@angular/core';
import { Pregunta } from '../interfaces/negocio.interface';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getPreguntasNegocio(id): Promise<Pregunta[]> {
    return new Promise((resolve, reject) => {
      const askSub = this.db.list(`solo-lectura/preguntas/${id}`, data => data.orderByKey().limitToLast(15))
        .valueChanges().subscribe((preguntas: Pregunta[]) => {
          askSub.unsubscribe();
          resolve(preguntas);
        });
    });
  }

  getPreguntas(id, batch, lastKey?): Promise<Pregunta[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`solo-lectura/preguntas/${id}`, data =>
          data.orderByKey().limitToLast(batch).startAt(lastKey))
            .valueChanges().subscribe((preguntas: Pregunta[]) => {
              x.unsubscribe();
              resolve(preguntas);
            });
      } else {
        const x = this.db.list(`solo-lectura/preguntas/${id}`, data =>
          data.orderByKey().limitToLast(batch)).valueChanges().subscribe((preguntas: Pregunta[]) => {
            x.unsubscribe();
            resolve(preguntas);
          });
      }
    });
  }

}
