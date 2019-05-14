import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(private db: AngularFireDatabase) { }

  getOfertasDestacadas() {
    return this.db.list(`ofertas`, data => data.orderByChild('tipo').equalTo(1)).valueChanges();
  }


}
