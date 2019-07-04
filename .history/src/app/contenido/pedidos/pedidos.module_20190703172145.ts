import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';

import { PedidosPage } from './pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LottieAnimationViewModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidosPage]
})
export class PedidosPageModule {}
