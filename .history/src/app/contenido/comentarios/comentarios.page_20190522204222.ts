import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  comentarios = [];

  constructor(private location: Location,
              private authService: AuthService,
              private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    const user: any = this.authService.revisa();
    const uid = user.uid;
    this.getComentarios(uid);
  }

  getComentarios(uid) {
    const comentariosSub = this.usuarioService.getComentarios(uid).subscribe(comentarios => {
      comentariosSub.unsubscribe();
      this.comentarios = Object.values(comentarios);
      console.log(this.comentarios);
    });
  }

  regresar() {
    this.location.back();
  }

}
