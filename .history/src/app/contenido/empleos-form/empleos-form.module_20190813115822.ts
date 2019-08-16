import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpleosFormPage } from './empleos-form.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [EmpleosFormPage],
  entryComponents: [EmpleosFormPage]
})
export class EmpleosFormPageModule {}
