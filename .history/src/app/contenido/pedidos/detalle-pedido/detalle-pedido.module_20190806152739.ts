import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DetallePedidoComponent } from './detalle-pedido.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [DetallePedidoComponent],
  entryComponents: [DetallePedidoComponent]
})
export class CartModalModule {}
