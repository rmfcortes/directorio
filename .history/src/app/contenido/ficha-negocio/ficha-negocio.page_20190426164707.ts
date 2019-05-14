import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage implements OnInit {

  origen: any;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.origen = this.activatedRoute.snapshot.paramMap.get('origen');
    console.log(this.origen);
  }

}
