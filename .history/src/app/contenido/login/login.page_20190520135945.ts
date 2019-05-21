import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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

  constructor(private authService: AuthService,
              private activedRoute: ActivatedRoute,
              private router: Router,
              public alertController: AlertController) { }

  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.accion = data['accion'];
      this.categoria = data['categoria'];
    });
  }

  verificarUsuario() {
    console.log('Prueba');
  }

  loginFace() {
    this.authService.facebookLogin().then(resp => {
      console.log(resp);
    })
    .catch(err => console.log(err));
  }

  loginGoogle() {
    this.authService.loginGoogle().then(resp => {
      console.log(resp);
      this.presentAlert();
      if (!resp) {
      }
    });
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

}
