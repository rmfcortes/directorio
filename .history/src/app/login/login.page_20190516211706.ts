import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: string;
  pass: string;

  constructor() { }

  ngOnInit() {
  }

  verificarUsuario() {
    console.log('Prueba');
  }

}
