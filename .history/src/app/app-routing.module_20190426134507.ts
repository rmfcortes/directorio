import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ofertas',
    pathMatch: 'full'
  },
  {
    path: 'ofertas',
    loadChildren: './ofertas/ofertas.module#OfertasPageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'ficha-oferta',
    loadChildren: './ficha-oferta/ficha-oferta.module#FichaOfertaPageModule'
  },
  {
    path: 'restaurantes',
    loadChildren: './restaurantes/restaurantes.module#RestaurantesPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
