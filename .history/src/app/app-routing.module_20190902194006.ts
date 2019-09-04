import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from 'src/app/services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
        children: [
          {
            path: '',
            loadChildren: './contenido/tabs/tabs.module#TabsPageModule',
            canActivate: [AuthGuardService]
          },
          {
            path: 'login',
            loadChildren: './login/login.module#LoginPageModule',
          },
        ]
      },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule {}
