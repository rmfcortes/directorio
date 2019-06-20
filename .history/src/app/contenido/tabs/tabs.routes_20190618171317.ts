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
                loadChildren: './contenido/negocios/negocios.module#NegociosPageModule'
              }
            ]
        },
        {
          path: 'clasificados-tab',
          children:
            [
              {
                path: '',
                loadChildren: './contenido/clasificados/clasificados.module#ClasificadosPageModule'
              }
            ]
        },
        {
          path: 'buscar-tab',
          children:
            [
              {
                path: '',
                loadChildren: './contenido/buscar/buscar.module#BuscarPageModule'
              }
            ]
        },
        {
          path: 'perfil-tab',
          children:
            [
              {
                path: '',
                loadChildren: './contenido/perfil/perfil.module#PerfilPageModule'
              }
            ]
        },
        {
          path: '',
          redirectTo: 'negocios-tab',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: 'negocios-tab',
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