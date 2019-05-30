import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AppComponent } from './app.component';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
        children: [
          {
            path: '',
            redirectTo: 'ofertas',
            pathMatch: 'full'
          },
          {
            path: 'ofertas',
            loadChildren: './contenido/ofertas/ofertas.module#OfertasPageModule'
          },
          { path: 'ficha-oferta',
            loadChildren: './contenido/ficha-oferta/ficha-oferta.module#FichaOfertaPageModule'
          },
          { path: 'lista/:categoria/:id',
            loadChildren: './contenido/ficha-negocio/ficha-negocio.module#FichaNegocioPageModule'
          },
          {
            path: 'lista/:categoria',
            loadChildren: './contenido/lista-negocios/lista.module#ListaPageModule'
          },
          {
            path: 'mapa/:id/:navegar',
            loadChildren: './contenido/mapa/mapa.module#MapaPageModule'
          },
          {
            path: 'login/:categoria/:id/:accion/:calificacion',
            loadChildren: './contenido/login/login.module#LoginPageModule'
          },
          {
            path: 'login/:categoria',
            loadChildren: './contenido/login/login.module#LoginPageModule'
          },
          {
            path: 'calificar/:id/:calificacion',
            loadChildren: './contenido/calificar/calificar.module#CalificarPageModule',
            canActivate: [AuthGuardService]
          },
          {
            path: 'anuncios',
            loadChildren: './contenido/anuncios/anuncios.module#AnunciosPageModule',
          },
          { path: 'comentarios', loadChildren: './contenido/comentarios/comentarios.module#ComentariosPageModule' },
          { path: 'favoritos', loadChildren: './contenido/favoritos/favoritos.module#FavoritosPageModule' },
          { path: 'bazar-form/:id', loadChildren: './contenido/bazar-form/bazar-form.module#BazarFormPageModule' },
          { path: 'empleos-form/:id', loadChildren: './contenido/empleos-form/empleos-form.module#EmpleosFormPageModule' },
          { path: 'inmuebles-form/:id', loadChildren: './contenido/inmuebles-form/inmuebles-form.module#InmueblesFormPageModule' },
          { path: 'oferta-form', loadChildren: './contenido/oferta-form/oferta-form.module#OfertaFormPageModule' },
          { path: 'lista-bazar', loadChildren: './contenido/lista-bazar/lista-bazar.module#ListaBazarPageModule' }
        ]
      },
  { path: 'lista-empleos', loadChildren: './contenido/lista-empleos/lista-empleos.module#ListaEmpleosPageModule' },
  { path: 'anuncio-detalle/:id', loadChildren: './contenido/anuncio-detalle/anuncio-detalle.module#AnuncioDetallePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
