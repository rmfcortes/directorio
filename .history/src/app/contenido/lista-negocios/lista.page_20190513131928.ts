import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegociosService } from '../services/negocios.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit, OnDestroy {

  categoria = '';
  categoriaSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private negociosService: NegociosService) { }

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.activatedRoute.params.subscribe( params => {
      this.categoria = params['categoria'];
      console.log(this.categoria);
      this.categoriaSub = this.negociosService.getNegocios(this.categoria).subscribe(result => {
        console.log(result);
      });
    });
  }

  verFichaNegocio() {

  }

  ngOnDestroy(): void {
    this.categoriaSub.unsubscribe();
  }

}
