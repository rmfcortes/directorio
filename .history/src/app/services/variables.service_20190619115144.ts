import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  toSave = false;
  toSaveArray = [];
  pagina = '';

  constructor() { }

  setSave(value) {
    this.toSave = value;
  }

  getSave() {
    return this.toSave;
  }

  setSaveArray(value, i) {
    this.toSaveArray[i] = value;
  }

  getSaveArray(i) {
    return this.toSaveArray[i];
  }

  setPagina(pagina) {
    this.toSave = pagina;
  }

  getPagina() {
    return this.pagina;
  }

}
