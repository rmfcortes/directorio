import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegociosService } from 'src/app/services/negocios.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage implements OnInit {

  categoria: string;
  id: string;
  origen: string;
  negocio: any;
  loader: any;
  infoReady = false;

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.presentLoading();
    this.activatedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.origen = '/lista/' + this.categoria;
      const negSub = this.negocioService.getNegocio(this.id).subscribe(result => {
        this.negocio = result;
        console.log(this.negocio);
        this.infoReady = true;
        negSub.unsubscribe();
        this.loader.dismiss();
      });
    });
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

}
