import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(private db: AngularFireDatabase) { }

  getOfertas() {
    return this.db.list(`ofertas`).valueChanges();
  }


}
