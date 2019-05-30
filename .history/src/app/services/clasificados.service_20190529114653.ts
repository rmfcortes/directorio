import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class BazarService {

  constructor(private db: AngularFireDatabase) { }

  getAnuncios() {
    return this.db.list('anuncios/bazar').valueChanges();
  }

}
