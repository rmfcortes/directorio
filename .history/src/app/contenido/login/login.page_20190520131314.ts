import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
              private router: Router) { }

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
    console.log('Google');
    this.authService.loginGoogle();
  }

  async revisa() {
    const user = await this.authService.revisa();
    console.log(user);
  }

  regresar() {
    if (this.accion === 'calificar') {
      this.router.navigate(['/lista', this.categoria, this.id]);
    }
    
  }

}
