import { Component, Input } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-horario-modal',
  templateUrl: './horario-modal.page.html',
  styleUrls: ['./horario-modal.page.scss'],
})
export class HorarioModalPage {

  @Input() value: number;

  constructor() {
    console.log(this.value);
   }


}
