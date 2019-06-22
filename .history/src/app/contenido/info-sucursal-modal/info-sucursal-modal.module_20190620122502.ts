import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InfoSucursalModalPage } from './info-sucursal-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InfoSucursalModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InfoSucursalModalPage]
})
export class InfoSucursalModalPageModule {}
