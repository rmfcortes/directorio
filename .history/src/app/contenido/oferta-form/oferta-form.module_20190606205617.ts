import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OfertaFormPage } from './oferta-form.page';
import { OfertaFormPipe } from '../oferta-form.pipe';

const routes: Routes = [
  {
    path: '',
    component: OfertaFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OfertaFormPage, OfertaFormPipe]
})
export class OfertaFormPageModule {}
