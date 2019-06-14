import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  private uid: string;
  public usuario: any;

  constructor() {  }

  setUid(uid) {
    this.uid = uid;
  }

  setUser(user) {
    this.usuario = user;
  }

  getUid() {
    return this.uid;
  }

}
