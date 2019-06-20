import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

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
                loadChildren: '.negocios/negocios.module#NegociosPageModule'
              }
            ]
        },
        {
          path: 'clasificados-tab',
          children:
            [
              {
                path: '',
                loadChildren: '.clasificados/clasificados.module#ClasificadosPageModule'
              }
            ]
        },
        {
          path: 'buscar-tab',
          children:
            [
              {
                path: '',
                loadChildren: '.buscar/buscar.module#BuscarPageModule'
              }
            ]
        },
        {
          path: 'perfil-tab',
          children:
            [
              {
                path: '',
                loadChildren: '.perfil/perfil.module#PerfilPageModule'
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
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class TabsPageRoutingModule {}