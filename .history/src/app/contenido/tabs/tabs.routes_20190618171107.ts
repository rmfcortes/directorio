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
                loadChildren: './contenido/ofertas/ofertas.module#NegociosPageModule'
              }
            ]
        },
        {
          path: 'clasificados-tab',
          children:
            [
              {
                path: '',
                loadChildren: '../tab2/tab2.module#ClasificadosPageModule'
              }
            ]
        },
        {
          path: 'buscar-tab',
          children:
            [
              {
                path: '',
                loadChildren: '../tab3/tab3.module#BuscarPageModule'
              }
            ]
        },
        {
          path: 'perfil-tab',
          children:
            [
              {
                path: '',
                loadChildren: '../tab3/tab3.module#PerfilPageModule'
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