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
          { path: 'lista/:categoria/:id',
            loadChildren: './ficha-negocio/ficha-negocio.module#FichaNegocioPageModule'
          },
          {
            path: 'lista/:categoria',
            loadChildren: './lista-negocios/lista.module#ListaPageModule'
          },
          {
            path: 'mapa/:id/:navegar',
            loadChildren: './mapa/mapa.module#MapaPageModule'
          },
          {
            path: 'login/:id',
            loadChildren: './login/login.module#LoginPageModule'
          },
          {
            path: 'calificar/:id',
            loadChildren: './calificar/calificar.module#CalificarPageModule'
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
