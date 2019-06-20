import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NegociosService } from 'src/app/services/negocios.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit, OnDestroy {

  categoria = '';
  negocios = [];
  categoriaSub: Subscription;
  infoReady = false;

  constructor(private activatedRoute: ActivatedRoute,
              private negociosService: NegociosService,
              private location: Location) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  getParams() {
    this.activatedRoute.params.subscribe( params => {
      this.categoria = params['categoria'];
      this.categoriaSub = this.negociosService.getNegocios(this.categoria).subscribe(result => {
        this.negocios = result;
        this.infoReady = true;
        console.log(this.negocios);
      });
    });
  }

  regresar() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.categoriaSub.unsubscribe();
  }

}
