import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasPage } from './preguntas.page';

describe('PreguntasPage', () => {
  let component: PreguntasPage;
  let fixture: ComponentFixture<PreguntasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreguntasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
