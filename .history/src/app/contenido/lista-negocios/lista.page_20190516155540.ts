import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NegociosService } from 'src/app/services/negocios.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit, OnDestroy {

  categoria = '';
  negocios = [];
  categoriaSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private negociosService: NegociosService,
              private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
    this.getParams();
  }

  getParams() {
    this.activatedRoute.params.subscribe( params => {
      this.categoria = params['categoria'];
      this.categoriaSub = this.negociosService.getNegocios(this.categoria).subscribe(result => {
        this.negocios = result;
        console.log(this.negocios);
      });
    });
  }

  verFichaNegocio() {

  }

  ngOnDestroy(): void {
    this.categoriaSub.unsubscribe();
  }

}
