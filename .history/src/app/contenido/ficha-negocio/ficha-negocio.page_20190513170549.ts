import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegociosService } from 'src/app/services/negocios.service';

@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage implements OnInit {

  origen: string;
  id: string;

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.origen = data['categoria'];
      console.log(this.id);
      console.log(this.origen);
    });
  }

}
