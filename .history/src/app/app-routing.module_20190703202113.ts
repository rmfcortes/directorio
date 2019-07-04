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
            loadChildren: './contenido/tabs/tabs.module#TabsPageModule'
          },
          {
            path: 'ofertas',
            loadChildren: './contenido/ofertas/ofertas.module#OfertasPageModule'
          },
          { path: 'ficha-oferta/:id/:favorito',
            loadChildren: './contenido/ficha-oferta/ficha-oferta.module#FichaOfertaPageModule'
          },
          { path: 'lista/:categoria/:id',
            loadChildren: './contenido/ficha-negocio/ficha-negocio.module#FichaNegocioPageModule'
          },
          {
            path: 'lista/:categoria',
            loadChildren: './contenido/lista-negocios/lista.module#ListaPageModule'
          },
          { path: 'bazar-form/:id', loadChildren: './contenido/bazar-form/bazar-form.module#BazarFormPageModule',
            canActivate: [AuthGuardService] },
          { path: 'empleos-form/:id', loadChildren: './contenido/empleos-form/empleos-form.module#EmpleosFormPageModule',
          canActivate: [AuthGuardService] },
          { path: 'inmuebles-form/:id', loadChildren: './contenido/inmuebles-form/inmuebles-form.module#InmueblesFormPageModule',
          canActivate: [AuthGuardService] },
          { path: 'lista-clasificados/:clasificados', loadChildren: './contenido/lista-bazar/lista-bazar.module#ListaBazarPageModule' },
          { path: 'lista-empleos', loadChildren: './contenido/lista-empleos/lista-empleos.module#ListaEmpleosPageModule' },
          // tslint:disable-next-line:max-line-length
          { path: 'ficha-bazar/:clasificado/:id/:categoria', loadChildren: './contenido/ficha-bazar/ficha-bazar.module#FichaBazarPageModule' },
          { path: 'ficha-bazar/:clasificado/:id', loadChildren: './contenido/ficha-bazar/ficha-bazar.module#FichaBazarPageModule' },
          { path: 'ficha-empleo/:id', loadChildren: './contenido/ficha-empleo/ficha-empleo.module#FichaEmpleoPageModule' },
        ]
      },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
