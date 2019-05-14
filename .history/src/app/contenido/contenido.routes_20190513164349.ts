import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContenidoPage } from './contenido.page';

const routes: Routes = [
  {
    path: '',
        component: ContenidoPage,
        children: [
          {
            path: '',
            redirectTo: 'ofertas',
          },
          {
            path: 'ofertas',
            loadChildren: './ofertas/ofertas.module#OfertasPageModule'
          },
          { path: 'ficha-oferta',
            loadChildren: './ficha-oferta/ficha-oferta.module#FichaOfertaPageModule'
          },
          { path: 'ficha-negocio/:id',
            loadChildren: './ficha-negocio/ficha-negocio.module#FichaNegocioPageModule'
          },
          {
            path: 'lista/:categoria',
            loadChildren: './lista-negocios/lista.module#ListaPageModule'
          }
        ]
      }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ContenidoRoutingModule {}
