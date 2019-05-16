import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'contenido',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: './contenido/contenido.module#ContenidoPageModule'
  },
  { path: 'mapa', loadChildren: './contenido/mapa/mapa.module#MapaPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
