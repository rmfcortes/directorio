import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoPage } from './contenido.page';

describe('ContenidoPage', () => {
  let component: ContenidoPage;
  let fixture: ComponentFixture<ContenidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenidoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
