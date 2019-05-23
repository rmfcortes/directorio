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

  loginWithEmail = false;

  constructor(private authService: AuthService,
              private activedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              public alertController: AlertController,
              public loadingCtrl: LoadingController) { }

  ngOnInit() {
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

  loginFace() {
    this.presentLoading();
    this.authService.facebookLogin().then(resp => {
      if (!resp) {
        this.presentAlert();
        return;
      }
      this.loader.dismiss();
      if (this.accion === 'menu') {
        this.location.back();
        return;
      }
      this.router.navigate(['/calificar', this.categoria, this.id, this.calificacion]);
    })
    .catch(err => {
      this.presentAlert();
    });
  }

  loginGoogle() {
    this.presentLoading();
    this.authService.loginGoogle().then((resp: any) => {
      console.log(resp);
      if (!resp) {
        this.presentAlert();
        return;
      }
      this.loader.dismiss();
      if (this.accion === 'menu') {
        this.location.back();
        return;
      }
      this.router.navigate(['/calificar', this.categoria, this.id, this.calificacion]);
    });
  }

  loginEmail() {
    this.loginWithEmail = true;
  }

  ingresarConCorreo() {
    
  }

  async revisa() {
    const user = await this.authService.revisa();
    console.log(user);
  }

  regresar() {
    if (this.accion === 'calificar') {
      this.router.navigate(['/lista', this.categoria, this.id]);
      return;
    }
    this.location.back();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Hubo un problema al intentar ingresar a tu cuenta',
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
