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
            path: 'login/:categoria/:id/:accion/:calificacion',
            loadChildren: './login/login.module#LoginPageModule'
          },
          {
            path: 'login/:categoria',
            loadChildren: './login/login.module#LoginPageModule'
          },
          {
            path: 'calificar/:id/:calificacion',
            loadChildren: './calificar/calificar.module#CalificarPageModule',
            canActivate: [AuthGuardService]
          },
          {
            path: 'anuncios',
            loadChildren: './anuncios/anuncios.module#AnunciosPageModule',
          },
          { path: 'comentarios', loadChildren: './comentarios/comentarios.module#ComentariosPageModule' },
          { path: 'favoritos', loadChildren: './favoritos/favoritos.module#FavoritosPageModule' },
          { path: 'bazar-form/:id', loadChildren: './bazar-form/bazar-form.module#BazarFormPageModule' },
          { path: 'empleos-form/:id', loadChildren: './empleos-form/empleos-form.module#EmpleosFormPageModule' },
          { path: 'inmuebles-form/:id', loadChildren: './inmuebles-form/inmuebles-form.module#InmueblesFormPageModule' },
          { path: 'oferta-form', loadChildren: './oferta-form/oferta-form.module#OfertaFormPageModule' },
          { path: 'lista-bazar', loadChildren: './lista-bazar/lista-bazar.module#ListaBazarPageModule' }
        ]
      }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
