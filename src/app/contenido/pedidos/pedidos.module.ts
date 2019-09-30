import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';
import { LottieAnimationViewModule } from 'ng-lottie';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { PedidosPage } from './pedidos.page';
import { DetallePedidoModule } from './detalle-pedido/detalle-pedido.module';
import { environment } from 'src/environments/environment';


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
    DetallePedidoModule,
    LottieAnimationViewModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
    RouterModule.forChild(routes)
  ],
  providers: [CallNumber],
  declarations: [PedidosPage]
})
export class PedidosPageModule {}
