import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaBazarPage } from './lista-bazar.page';
import { FichaBazarPageModule } from './ficha-bazar/ficha-bazar.module';
import { BazarFormPageModule } from '../bazar-form/bazar-form.module';
import { InmueblesFormPageModule } from '../inmuebles-form/inmuebles-form.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FichaBazarPageModule,
    BazarFormPageModule,
    InmueblesFormPageModule
  ],
  declarations: [ListaBazarPage],
  entryComponents: [ListaBazarPage]
})
export class ListaBazarPageModule {}
