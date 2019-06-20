import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  toSave = false;
  index = null;
  pagina = '';

  constructor() { }

  setSave(value) {
    this.toSave = value;
  }

  getSave() {
    return this.toSave;
  }

  setIndex(value) {
    this.index = value;
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
