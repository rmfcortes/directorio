import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:
      [
        {
          path: 'negocios-tab',
          children:
            [
              {
                path: '',
                loadChildren: '../negocios/negocios.module#NegociosPageModule',
                canActivate: [ AuthGuardService ]
              }
            ]
        },
        {
          path: 'favoritos-tab',
          children:
            [
              {
                path: '',
                loadChildren: '../favoritos/favoritos.module#FavoritosPageModule',
                canActivate: [ AuthGuardService ]
              }
            ]
        },
        {
          path: 'buscar-tab',
          children:
            [
              {
                path: '',
                loadChildren: '../buscar/buscar.module#BuscarPageModule',
                canActivate: [ AuthGuardService ]
              }
            ]
        },
        {
          path: 'pedidos-tab',
          children:
            [
              {
                path: '',
                loadChildren: '../pedidos/pedidos.module#PedidosPageModule',
                canActivate: [ AuthGuardService ]
              }
            ]
        },
        {
          path: 'perfil-tab',
          children:
            [
              {
                path: '',
                loadChildren: '../perfil/perfil.module#PerfilPageModule',
                canActivate: [ AuthGuardService ]
              }
            ]
        },
        {
          path: '',
          redirectTo: 'tabs/negocios-tab',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: 'tabs/negocios-tab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: [ AuthGuardService ]
})
export class TabsPageRoutingModule {}