import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController  } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: string;
  pass: string;
  id: string;
  categoria: string;
  accion: string;
  calificacion: string;
  loader: any;

  usuario = {
    nombre: '',
    pass: '',
    passConfirm: '',
    correo: '',
  };

  loginWithEmail = false;
  creaCuenta = false;

  constructor(private authService: AuthService,
              private activedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              public alertController: AlertController,
              public loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.activedRoute.params.subscribe(data => {
      if (data) {
        this.categoria = data['categoria'];
        if (this.categoria === 'menu') {
          this.accion = 'menu';
          return;
        }
        this.id = data['id'];
        this.accion = data['accion'];
        this.calificacion = data['calificacion'];
      }
    });
  }

  async loginFace() {
    this.presentLoading();
    try {
      await this.authService.facebookLogin();
      this.redireccionar();
    } catch (error) {
      this.presentAlert(error);
    }
  }

  async loginGoogle() {
    this.presentLoading();
    try {
      await this.authService.loginGoogle();
      this.redireccionar();
    } catch (error) {
      this.presentAlert(error);
    }
  }

  async ingresarConCorreo() {
    this.presentLoading();
    try {
      await this.authService.loginWithEmail(this.correo, this.pass);
      this.redireccionar();
    } catch (error) {
      this.presentAlert(error);
    }
  }

  async generarCuenta() {
    this.presentLoading();
    try {
      await this.authService.registraUsuario(this.usuario);
      this.redireccionar();
    } catch (error) {
        this.presentAlert(error);
    }
  }

  loginEmail() {
    this.loginWithEmail = true;
  }

  crearCuentaEmail() {
    this.loginWithEmail = false;
    this.creaCuenta = true;
  }

  async revisa() {
    const user = await this.authService.revisa();
    console.log(user);
  }

  redireccionar() {
    this.loader.dismiss();
    if (this.accion === 'menu') {
      this.location.back();
      return;
    }
    this.router.navigate(['/calificar', this.categoria, this.id, this.calificacion]);
  }

  regresar() {
    if (this.accion === 'calificar') {
      this.router.navigate(['/lista', this.categoria, this.id]);
      return;
    }
    this.location.back();
  }

  regresarEmail() {
    this.loginWithEmail = false;
  }

  regresarCuenta() {
    this.loginWithEmail = true;
    this.creaCuenta = false;
  }

  async presentAlert(mensaje) {
    this.loader.dismiss();
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: mensaje,
      message: 'Por favor intenta de nuevo o utiliza un proveedor distinto',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

}
