import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComentariosModalPage } from './lista-comentarios-modal.page';

describe('ListaComentariosModalPage', () => {
  let component: ListaComentariosModalPage;
  let fixture: ComponentFixture<ListaComentariosModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaComentariosModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaComentariosModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
