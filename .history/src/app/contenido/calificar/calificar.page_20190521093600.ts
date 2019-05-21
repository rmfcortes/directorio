import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  id: string;
  uid: string;
  categoria: string;
  origen: string;

  comentario = {
    descripcion: '',
    calificacion: null,
    fecha: new Date(),
    url: '',
    usuario: ''
  };

  infoReady = false;

  constructor(private activedRoute: ActivatedRoute,
              private authService: AuthService,
              private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getParams();
    this.getUserInfo();
  }

  getParams() {
    this.activedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.comentario.calificacion = data['calificacion'];
      this.origen = '/lista/' + this.categoria + '/' + this.id;
    });
  }

  getUserInfo() {
    this.authService.revisa().then((user: any) => {
      if (user) {
        this.comentario.url = user.photoURL;
        this.comentario.usuario = user.displayName;
        this.infoReady = true;
        this.uid = user.uid;
        this.getComentario();
      }
      console.log(user);
    });
  }

  getComentario() {
    const userSub = this.usuarioService.getComentario(this.uid, this.id).subscribe((data: any) => {
      userSub.unsubscribe();
      if (data) {
        this.comentario.descripcion = data.comentario;
      }
    });
  }

  publicarComentario() {
    this.usuarioService.publicarComentario(this.comentario, this.uid, this.id);
  }

}
