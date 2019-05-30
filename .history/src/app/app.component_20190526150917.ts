import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CategoriasService } from './services/categorias.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  categoriaSub: Subscription;
  categorias = [];
  menuGeneral = true;
  menuAccount = false;
  muestraOpcionesPerfil = false;
  muestraOpcionesClasificados = false;
  user = {
    foto: '../../assets/images/no-foto-perfil.png',
    nombre:  '',
    apellido: ''
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private categoriaService: CategoriasService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async ionViewDidEnter() {
    this.getStatus();
    this.getCategorias();
  }

  getStatus() {
    this.authService.revisaSub().subscribe(user => {
      if (user) {
        console.log(user);
        if (user.photoURL) {
          this.user.foto = user.photoURL;
        }
        this.user.nombre = user.displayName;
        this.menuAccount = true;
        this.menuGeneral = false;
        return;
      }
      this.menuAccount = false;
      this.menuGeneral = true;
    });
    console.log(this.menuAccount);
    console.log(this.menuGeneral);
  }

  getCategorias() {
    this.categoriaSub = this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;
      this.categorias.sort((a, b) => a.posicion - b.posicion);
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/ofertas']);
  }

  ngOnDestroy(): void {
    this.categoriaSub.unsubscribe();
  }
}
