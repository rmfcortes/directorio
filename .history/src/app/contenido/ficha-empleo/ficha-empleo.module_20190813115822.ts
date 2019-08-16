import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { FichaEmpleoPage } from './ficha-empleo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [FichaEmpleoPage],
  entryComponents: [FichaEmpleoPage],
  providers: [CallNumber],
})
export class FichaEmpleoPageModule {}
