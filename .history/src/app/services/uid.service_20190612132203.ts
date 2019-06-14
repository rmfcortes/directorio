import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  private uid: string;
  public usuario = new Subject<any>();

  constructor() {  }

  setUid(uid) {
    this.uid = uid;
  }

  setUser(user) {
    this.usuario.next(user);
    console.log(user);
  }

  getUid() {
    return this.uid;
  }

}
