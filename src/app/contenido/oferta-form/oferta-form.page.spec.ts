import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaFormPage } from './oferta-form.page';

describe('OfertaFormPage', () => {
  let component: OfertaFormPage;
  let fixture: ComponentFixture<OfertaFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertaFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
