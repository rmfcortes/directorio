import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegociosService } from 'src/app/services/negocios.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  negocio: any;
  id: string;
  navegar: boolean;
  origen: string;
  infoReady: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService) { }

  ngOnInit() {
    this.getDatos();
  }

  getDatos() {
    this.activatedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.navegar = data['navegar'];
      const negSub = this.negocioService.getNegocio(this.id).subscribe(result => {
        this.negocio = result;
        console.log(this.negocio);
        this.infoReady = true;
        negSub.unsubscribe();
        // this.loadMap();
        this.origen = '/lista/' + this.negocio.categoria + '/' + this.negocio.id;
      });
      console.log(this.negocio);
      console.log(this.navegar);
      console.log(this.origen);
    });
  }

}
