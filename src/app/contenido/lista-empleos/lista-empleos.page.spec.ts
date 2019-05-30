import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEmpleosPage } from './lista-empleos.page';

describe('ListaEmpleosPage', () => {
  let component: ListaEmpleosPage;
  let fixture: ComponentFixture<ListaEmpleosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaEmpleosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEmpleosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
