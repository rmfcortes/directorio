import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  toSave = false;
  pendiente = '';
  index = null;
  pagina = '';

  constructor() { }

  setSave(value) {
    this.toSave = value;
  }

  getSave() {
    return this.toSave;
  }

  setPendientType(value) {
    this.pendiente = value;
  }

  getPendientType() {
    return this.pendiente;
  }

  setIndex(value, y?) {
    let pos = value;
    console.log(y);
    if(y) {
      pos = {
        pri: value,
        sec: y
      };
    }
    this.index = pos;
  }

  getIndex() {
    return this.index;
  }

  setPagina(pagina) {
    this.toSave = pagina;
  }

  getPagina() {
    return this.pagina;
  }

}
