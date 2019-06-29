import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicRatingModule } from 'ionic4-rating';
import { IonicModule } from '@ionic/angular';

import { CalificarPage } from './calificar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule
  ],
  declarations: [CalificarPage],
  entryComponents: [CalificarPage]
})
export class CalificarPageModule {}
