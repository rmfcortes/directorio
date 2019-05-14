import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'ofertas',
    loadChildren: './ofertas/ofertas.module#OfertasPageModule'
  },
  { path: 'ficha-oferta',
    loadChildren: './ficha-oferta/ficha-oferta.module#FichaOfertaPageModule'
  },
  {
    path: 'lista/:categoria',
    loadChildren: './lista-negocios/lista.module#ListaPageModule'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
