import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { NegociosService } from 'src/app/services/negocios.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { InfoSucursalModalPage } from '../info-sucursal-modal/info-sucursal-modal.page';


@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage implements OnInit {

  categoria: string;
  id: string;
  negocio: any;
  infoReady = false;
  despliegueHorario = false;

  ubicacionReady = false;

  valoraciones = {
    resumen: {
      cantidad: 0,
      promedio: 0,
    },
    comentarios: [{
      comentario: '',
      usuario: '',
      url: '',
      fecha: '',
      puntos: ''
    }]
  };

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  calificaciones = [
    {
    valor: 5,
    cantidad: 0,
    },
    {
    valor: 4,
    cantidad: 0,
    },
    {
    valor: 3,
    cantidad: 0,
    },
    {
    valor: 2,
    cantidad: 0,
    },
    {
    valor: 1,
    cantidad: 0,
    }
  ];

  opiniones = [];

  dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  categorias = 'resumen';
  puntuacion = 0;

  guardado = false;
  guardando = false;

  noLongerExist = false;

  pagina = 'resumen';
  hasProductos = false;
  hasOfertas = false;

  sliderConfig = {
    slidesPerView: 1,
    autoplay: true,
    centeredSlides: true,
    speed: 400
  };

  productosDestacados: any;
  productos: any;
  pasillos: any;
  ofertas: any;
  sucursales = [];


  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService,
              private authService: AuthService,
              private usuarioService: UsuarioService,
              public alertController: AlertController,
              private modalController: ModalController,
              private callNumber: CallNumber,
              private router: Router,
              private location: Location) { }

  async ngOnInit() {
  }

  async ionViewDidEnter() {
    this.getDatos();
  }

  async getDatos() {
    this.activatedRoute.params.subscribe(async (data) => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      const prevData = await this.negocioService.getTemporal();
      const result =  await this.negocioService.getNegocio(this.id);
      if (!result) {
        this.noLongerExist = true;
        return;
      }
      this.negocio = {...result, ...prevData};
      this.sucursales = Object.values(this.negocio.sucursales);
      console.log(this.negocio);

      if (this.negocio.hasProductos) {
        this.productosDestacados = await this.negocioService.getProductosDestacados(this.id);
        this.productos = await this.negocioService.getProductos(this.id);
        this.pasillos = await this.negocioService.getPasillos(this.id);
        this.hasProductos = true;
        this.pagina = 'productos';
        console.log(this.productosDestacados);
        console.log(this.productos);
      }
      if (this.negocio.hasOfertas) {
        this.ofertas = await this.negocioService.getOfertasNegocio(this.id);
        console.log(this.ofertas);
        this.hasOfertas = true;
      }

      await this.isFavorito();
      if (this.negocio.hasValoraciones) {
        await this.getValoraciones();
        if (this.valoraciones.resumen.cantidad > 0) {
          await this.getCantidadValoraciones();
        }
      }
      await this.getOpinionesMuestra();
      this.ubicacionReady = true;
      this.infoReady = true;
    });
  }

  async isFavorito() {
    try {
      const resp = await this.usuarioService.getFavorito(this.negocio.id, this.categoria);
      if (resp) {
        this.guardado = true;
      } else {
        this.guardado = false;
      }
    } catch (err) {
      this.presentAlertError(err);
    }
    return;
  }

  getValoraciones() {
    return new Promise((resolve, reject) => {
      const valorSub = this.negocioService.getValoraciones(this.id).subscribe( (data: any) => {
        console.log(data);
        this.valoraciones = data;
        valorSub.unsubscribe();
        resolve(this.valoraciones);
      });
    });
  }

  getCantidadValoraciones() {
    this.calificaciones.forEach( calificacion => {
      const listaFiltrada = Object.values(this.valoraciones.comentarios).filter( p => parseInt(p.puntos, 10) === calificacion.valor);
      calificacion.cantidad = listaFiltrada.length || 0.1;
    });
    return;
  }

  getOpinionesMuestra() {
    this.opiniones = Object.values(this.valoraciones.comentarios).slice();
    this.opiniones.sort((a, b) => parseInt(b.puntos, 10) - parseInt(a.puntos, 10));
    this.opiniones = this.opiniones.slice(0, 3);
    return;
  }

  async presentInfoSucursal(i) {
    this.sucursales[i].id = this.id;
    const modal = await this.modalController.create({
      component: InfoSucursalModalPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { value: this.sucursales[i] }
    });
    return await modal.present();
  }

  llamar() {
    this.callNumber.callNumber(this.negocio.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  scrollTo(pasillo) {
    console.log(pasillo);
    document.getElementById(pasillo).scrollIntoView();
  }

  async agregarFavorito() {
    this.guardando = true;
    const favorito = {
      nombre: this.negocio.nombre,
      url: this.negocio.url[0],
      descripcion: this.negocio.descripcion,
      id: this.negocio.id,
      categoria: this.negocio.categoria,
    };
    try {
      await this.usuarioService.guardarFavorito(favorito);
      this.guardando = false;
      this.guardado = true;
    } catch (error) {
      this.guardando = false;
      this.presentAlertError(error);
    }
  }

  async borrarFavorito() {
    try {
      await this.usuarioService.borrarFavorito(this.negocio.id, this.negocio.categoria);
      this.guardado = false;
    } catch (error) {
      console.log(error);
    }
  }

  async rateChange() {
    const user: any = await this.authService.revisa();
    if (!user) {
      this.router.navigate(['/login', this.negocio.categoria, this.negocio.id, 'calificar', this.puntuacion]);
      return;
    }
    this.router.navigate(['/calificar', this.negocio.id, this.puntuacion]);
  }

  async presentAlertError(error) {
    const alert = await this.alertController.create({
      header: 'Ups, algo salió mal, intenta de nuevo',
      message: error,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }

  regresar() {
    this.location.back();
  }

}
