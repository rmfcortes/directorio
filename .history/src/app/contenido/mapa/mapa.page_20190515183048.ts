import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  negocio: any;
  navegar: boolean;
  origen: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getDatos();
  }

  getDatos() {
    this.activatedRoute.params.subscribe(data => {
      this.negocio = data['negocio'];
      this.navegar = data['navegar'];
      this.origen = '/lista/' + this.negocio.categoria + '/' + this.negocio.id;
      console.log(this.negocio);
      console.log(this.navegar);
      console.log(this.origen);
    });
  }

}
