import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from 'src/app/services/auth.service';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
        children: [
          {
            path: '',
            loadChildren: './contenido/tabs/tabs.module#TabsPageModule',
            canActivate: [AuthService]
          },
        ]
      },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthService]
})
export class AppRoutingModule {}
