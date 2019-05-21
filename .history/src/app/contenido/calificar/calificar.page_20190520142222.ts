import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  id: string;
  categoria: string;
  calificacion: string;
  origen: string;

  foto: string;
  nombre: string;

  constructor(private activedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.getParams();
    this.getUserInfo();
  }

  getParams() {
    this.activedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.calificacion = data['calificacion'];
      this.origen = '/lista/' + this.categoria + '/' + this.id;
    });
  }

  getUserInfo() {
    this.authService.revisa().then((user: any) => {
      if (user) {
        this.foto = user.photoURL;
        this.nombre = user.displayName;
      }
      console.log(user);
    })
  }

}
