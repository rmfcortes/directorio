import { Component, OnInit } from '@angular/core';
import { ClasificadosService } from 'src/app/services/clasificados.service';

@Component({
  selector: 'app-lista-empleos',
  templateUrl: './lista-empleos.page.html',
  styleUrls: ['./lista-empleos.page.scss'],
})
export class ListaEmpleosPage implements OnInit {

  infoReady: boolean;
  empleos = [];
  hasEmpleos: boolean;

  constructor(private empleosService: ClasificadosService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getEmpleos();
  }

  getEmpleos() {
    const anunSub = this.empleosService.getEmpleos().subscribe((empleos: any) => {
      anunSub.unsubscribe();
      if (empleos) {
        this.hasEmpleos = true;
        this.empleos = empleos;
        console.log(this.empleos);
        this.infoReady = true;
      } else {
        this.infoReady = true;
        this.empleos = [];
        this.hasEmpleos = false;
      }
    });
  }

}
