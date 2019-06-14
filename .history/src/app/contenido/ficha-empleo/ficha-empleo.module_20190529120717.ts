import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FichaEmpleoPage } from './ficha-empleo.page';

const routes: Routes = [
  {
    path: '',
    component: FichaEmpleoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FichaEmpleoPage]
})
export class FichaEmpleoPageModule {}