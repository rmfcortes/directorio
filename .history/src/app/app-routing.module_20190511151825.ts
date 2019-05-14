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
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'ficha-oferta',
    loadChildren: './ficha-oferta/ficha-oferta.module#FichaOfertaPageModule'
  },
  {
    path: 'lista',
    loadChildren: './lista-negocios/lista.module#ListaPageModule'
  },
  {
    path: 'ficha-negocio/:origen/:id',
    loadChildren: './ficha-negocio/ficha-negocio.module#FichaNegocioPageModule'
  },
  {
    path: 'categoria/:giro',
    loadChildren: './categorias/categorias.module#CategoriasPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
