import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { LottieAnimationViewModule } from 'ng-lottie';

import { IonicModule } from '@ionic/angular';

import { FavoritosPage } from './favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritosPage
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
  declarations: [FavoritosPage]
})
export class FavoritosPageModule {}
