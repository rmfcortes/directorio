import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  toSave = false;
  loaded = false;
  pendiente = '';
  index = null;
  pagina = '';
  info = [];

  constructor() { }

  setSave(value) {
    this.toSave = value;
  }

  getSave() {
    return this.toSave;
  }

  setLoaded(value) {
    this.loaded = value;
  }

  getLoaded() {
    return this.loaded;
  }

  setInfo(value) {
    this.info = value;
  }

  getInfo() {
    return this.info;
  }

  setPendientType(value) {
    this.pendiente = value;
  }

  getPendientType() {
    return this.pendiente;
  }

  setIndex(value, y?) {
    let pos = value;
    if (y !== null || y !== undefined) {
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
