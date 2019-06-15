import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  toSave = false;

  constructor() { }

  setSave(value) {
    this.toSave = value;
  }

  getSave() {
    return this.toSave;
  }

}
