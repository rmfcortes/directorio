import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegociosService } from 'src/app/services/negocios.service';
import { LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

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
  status: string;

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService,
              private loadingCtrl: LoadingController,
              private datePipe: DatePipe) { }

  async ngOnInit() {
    await this.presentLoading();
    this.activatedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.origen = '/lista/' + this.categoria;
      const negSub = this.negocioService.getNegocio(this.id).subscribe(result => {
        this.negocio = result;
        console.log(this.negocio);
        this.infoReady = true;
        negSub.unsubscribe();
        this.isOpen();
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

  isOpen() {
    const fecha = new Date();
    const dia = this.datePipe.transform(fecha, 'EEEE');
    const i = this.dias.indexOf(dia);
    const horas = this.negocio.horario[i].horaApertura.split(':');
    const cierre = this.negocio.horario[i].horaCierre.split(':');
    const hora = horas[0];
    const min = horas[1];
    const chora = cierre[0];
    const cmin = cierre[1];
    const  aTime = fecha.setHours(parseInt(hora, 10), parseInt(min, 10));
    const  cTime = fecha.setHours(parseInt(chora, 10), parseInt(cmin, 10));
    let reapertura;
    let aCTime;
    let cierreComida;
    let cCTime;
    if (this.negocio.horario[i].reapertura) {
      reapertura = this.negocio.horario[i].reapertura.split(':');
      const horaC = reapertura[0];
      const minC = reapertura[1];
      aCTime = fecha.setHours(parseInt(horaC, 10), parseInt(minC, 10));
    }

    if (this.negocio.horario[i].cierreComida) {
      cierreComida = this.negocio.horario[i].cierreComida.split(':');
      const horaC = cierreComida[0];
      const minC = cierreComida[1];
      cCTime = fecha.setHours(parseInt(horaC, 10), parseInt(minC, 10));
    }
    if (this.negocio.horario[i].activo === true ) {
      const now = Date.now();
      if (now > aTime && now < cTime) {
        if (this.negocio.horario[i].comida) {
          if ( now > cCTime && now < aCTime) {
            this.status = `Cerrado. Abre: ${this.negocio.horario[i].reapertura}`;
            this.loader.dismiss();
            return;
          } else if ( now > aCTime) {
            const diferencia = cTime - now;
            if (diferencia < 3600000) {
              this.status = `Cierra pronto ${this.negocio.horario[i].horaCierre}`;
              this.loader.dismiss();
              // clase alerta
              return;
            }
            this.status = 'Abierto';
          } else {
            const diferencia = cCTime - now;
            if (diferencia < 3600000) {
              this.status = `Cierra pronto ${this.negocio.horario[i].cierreComida}.
                            Abre nuevamente: ${this.negocio.horario[i].reapertura}`;
              this.loader.dismiss();
              // clase alerta
              return;
            }
            this.status = 'Abierto';
          }
        } else {
          const diferencia = cTime - now;
          if (diferencia < 3600000) {
            this.status = `Cierra pronto ${this.negocio.horario[i].horaCierre}`;
            this.loader.dismiss();
            // clase alerta
            return;
          }
          this.status = 'Abierto';
          this.loader.dismiss();
        }
      } else {
        this.status = 'Cerrado';
        this.loader.dismiss();
      }
    }

  }

}
