import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InmueblesFormPage } from './inmuebles-form.page';

const routes: Routes = [
  {
    path: '',
    component: InmueblesFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InmueblesFormPage]
})
export class InmueblesFormPageModule {}
