import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaBazarPage } from './lista-bazar.page';
import { FichaBazarPageModule } from './ficha-bazar/ficha-bazar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FichaBazarPageModule
  ],
  declarations: [ListaBazarPage],
  entryComponents: [ListaBazarPage]
})
export class ListaBazarPageModule {}
