import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmpleosFormPage } from './empleos-form.page';

const routes: Routes = [
  {
    path: '',
    component: EmpleosFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmpleosFormPage]
})
export class EmpleosFormPageModule {}
