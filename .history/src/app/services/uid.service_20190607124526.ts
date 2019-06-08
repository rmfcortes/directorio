import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  private uid: string;

  constructor() { }

  setUid(uid) {
    this.uid = uid;
  }

  getUid() {
    return this.uid;
  }

}
