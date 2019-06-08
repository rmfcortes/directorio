import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorarioModalPage } from './horario-modal.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [HorarioModalPage],
  entryComponents: [HorarioModalPage]
})
export class HorarioModalPageModule {}
