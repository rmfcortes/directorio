import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  toSave = false;
  pagina = '';

  constructor() { }

  setSave(value) {
    this.toSave = value;
  }

  getSave() {
    return this.toSave;
  }

  setPagina(pagina) {
    this.toSave = pagina;
  }

  getPagina() {
    return this.pagina;
  }

}
