import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private activedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.calificacion = data['calificacion'];
      this.origen = '/lista/' + this.categoria + this.id;
    });
  }

}
