import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-sucursal-modal',
  templateUrl: './info-sucursal-modal.page.html',
  styleUrls: ['./info-sucursal-modal.page.scss'],
})
export class InfoSucursalModalPage implements OnInit {

  @Input() value: object;

  constructor() { }

  ngOnInit() {
    console.log(this.value);
  }

}
