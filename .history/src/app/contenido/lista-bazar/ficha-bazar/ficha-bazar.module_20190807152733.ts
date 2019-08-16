import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichaBazarPage } from './ficha-bazar.page';

import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [FichaBazarPage],
  entryComponents: [FichaBazarPage],
  providers: [CallNumber],
})
export class FichaBazarPageModule {}
