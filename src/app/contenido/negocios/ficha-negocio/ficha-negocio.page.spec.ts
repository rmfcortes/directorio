import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaNegocioPage } from './ficha-negocio.page';

describe('FichaNegocioPage', () => {
  let component: FichaNegocioPage;
  let fixture: ComponentFixture<FichaNegocioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaNegocioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaNegocioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
