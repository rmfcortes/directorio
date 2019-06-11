import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AngularCropperjsModule } from 'angular-cropperjs';

import { CropModalPage } from './crop-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularCropperjsModule,
  ],
  declarations: [CropModalPage],
  entryComponents: [CropModalPage]
})
export class CropModalPageModule {}
