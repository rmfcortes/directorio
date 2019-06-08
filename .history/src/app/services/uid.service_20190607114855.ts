import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  private uid: string;

  constructor() { }

  setUid(uid) {
    this.uid = uid;
    console.log('Set uid:' + this.uid);
  }

  getUid() {
    console.log('Get uid:' + this.uid);
    return this.uid;
  }

}
