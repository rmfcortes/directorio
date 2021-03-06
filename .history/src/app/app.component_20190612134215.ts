import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UidService } from './services/uid.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {

  categoriaSub: Subscription;
  categorias = [
    {
      nombre: 'Comida',
      foto: '../assets/images/restaurantes.png'
    },
    {
      nombre: 'Salud',
      foto: '../assets/images/salud.png'
    },
    {
      nombre: 'Automotriz',
      foto: '../assets/images/autos.png'
    },
    {
      nombre: 'Tiendas',
      foto: '../assets/images/tiendas.png'
    },
    {
      nombre: 'Directorio de servicios',
      foto: '../assets/images/emergencia.png'
    },
    {
      nombre: 'Otros',
      foto: '../assets/images/otros.png'
    },
  ];
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
    private authService: AuthService,
    private uidService: UidService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  }

  ngOnInit(): void {
    console.log('init');
    this.authService.revisa();
  }

  async ionViewDidEnter() {
    await this.getStatus();
    this.splashScreen.hide();
  }

  async getStatus() {
    console.log('status');
    return new Promise(async (resolve, reject) => {
      this.uidService.usuario.subscribe((user: any) => {
        console.log(user);
        if (user !== 'inactivo' && user) {
          if (user.foto) {
            this.user.foto = user.foto;
          }
          this.user.nombre = user.nombre;
          this.menuAccount = true;
          this.menuGeneral = false;
          resolve();
        } else {
          this.menuAccount = false;
          this.menuGeneral = true;
          resolve();
        }
        console.log(this.menuAccount);
        console.log(this.menuGeneral);
      });
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
