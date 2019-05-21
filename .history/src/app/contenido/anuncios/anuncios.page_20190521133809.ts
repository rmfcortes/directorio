import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {

  constructor(authService: AuthService,
              userService: UsuarioService) { }

  ngOnInit() {
    this.getUsuario();
  }

  async getUsuario() {
    const user = await this.authService
  }

}
