import { Component, OnInit, Input } from '@angular/core';
import { AlertController, LoadingController, ModalController  } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @Input() tipo: string;

  correo: string;
  pass: string;
  loader: any;

  usuario = {
    nombre: '',
    pass: '',
    passConfirm: '',
    correo: '',
  };

  loginWithEmail = false;
  creaCuenta = false;

  mensaje: string;

  constructor(private authService: AuthService,
              private modalController: ModalController,
              public alertController: AlertController,
              public loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (this.tipo === 'favorito') {
      this.mensaje = 'Inicia sesión para sincronizar tus negocios, ofertas y anuncios favoritos en todos tus dispositivos ' +
                      'y no perderlos nunca';
      return;
    }
    if (this.tipo === 'producto') {
      this.mensaje = 'Inicia sesión para sincronizar tu carrito de compra y productos favoritos en todos tus dispositivos ' +
      'y no perderlos nunca';
      return;
    }
    if (this.tipo === 'anuncio') {
      this.mensaje = 'Antes de continuar. ' +
      'Inicia sesión para guardar tus anuncios publicados en todos tus dispositivos y no perderlos nunca';
      return;
    }
    if (this.tipo === 'pregunta') {
      this.mensaje = 'Antes de continuar. ' +
      'Inicia sesión para guardar tus preguntas en todos tus dispositivos y no perderlas nunca';
      return;
    }
    if (this.tipo === 'calificar') {
      this.mensaje = 'Antes de continuar. ' +
      'Inicia sesión para guardar tus comentarios y reseñas en todos tus dispositivos y no perderlos nunca';
      return;
    }
    if (this.tipo === 'inicio') {
      this.mensaje = 'Aún no tienes una cuenta. ' +
      'Regístrate para mantener tu información actualizada en todos tus dispositivos';
      return;
    }
  }

  async loginFace() {
    await this.presentLoading();
    try {
      const resp = await this.authService.facebookLogin();
      console.log(resp);
      this.presentSuccess('Ahora puedes publicar anuncios, calificar y compartir tus experiencias en diferentes negocios y mucho más...');
    } catch (error) {
      this.presentAlert(error);
    }
  }

  async loginGoogle() {
    await this.presentLoading();
    try {
      await this.authService.loginGoogle();
      this.presentSuccess('Ahora puedes publicar anuncios, calificar y compartir tus experiencias en diferentes negocios y mucho más...');
    } catch (error) {
      this.presentAlert(error);
    }
  }

  async ingresarConCorreo() {
    await this.presentLoading();
    try {
      await this.authService.loginWithEmail(this.correo, this.pass);
      this.presentSuccess('Ahora puedes publicar anuncios, calificar y compartir tus experiencias en diferentes negocios y mucho más...');
    } catch (error) {
      this.presentAlert(error);
    }
  }

  async generarCuenta() {
    await this.presentLoading();
    try {
      await this.authService.registraUsuario(this.usuario);
      this.presentSuccess('Ahora puedes publicar anuncios, calificar y compartir tus experiencias en diferentes negocios y mucho más...');
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

  async presentSuccess(mensaje) {
    this.loader.dismiss();
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: mensaje,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.regresar();
        }
      }],
    });

    await alert.present();
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

  async regresar() {
    await this.modalController.dismiss();
  }

}
