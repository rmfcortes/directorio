import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImagePicker } from '@ionic-native/image-picker/ngx';

import { BazarFormPage } from './bazar-form.page';

const routes: Routes = [
  {
    path: '',
    component: BazarFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [ImagePicker],
  declarations: [BazarFormPage]
})
export class BazarFormPageModule {}
