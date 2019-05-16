import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.scss'],
})
export class ModalMapComponent implements OnInit {

  @Input() destino: any;

  constructor() { }

  ngOnInit() {}

}
