import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegociosService } from 'src/app/services/negocios.service';

@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage implements OnInit {

  categoria: string;
  id: string;
  origen: string;

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      console.log(this.id);
      console.log(this.categoria);
      this.origen = '/lista' + this.categoria;
    });
  }

}