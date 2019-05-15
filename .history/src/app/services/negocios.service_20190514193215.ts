import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(private db: AngularFireDatabase) { }

  getNegocios(categoria) {
    return this.db.list('negocios', data => data.orderByChild('categoria').equalTo(categoria)).valueChanges();
  }

  getNegocio(id) {
    return this.db.object(`negocios/${id}`).valueChanges();
  }

  getValoraciones(id) {
    return this.db.list(`valoraciones/${id}`).valueChanges();
  }
}
