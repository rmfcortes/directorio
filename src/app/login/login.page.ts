import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: string;
  pass: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
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
    })
    .catch(err => console.log(err));
  }

  revisa() {
    this.authService.revisa().subscribe(resp => {
      console.log(resp);
    });
  }

  salir() {
    this.authService.logout();
  }

}
