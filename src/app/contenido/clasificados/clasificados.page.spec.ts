import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificadosPage } from './clasificados.page';

describe('ClasificadosPage', () => {
  let component: ClasificadosPage;
  let fixture: ComponentFixture<ClasificadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasificadosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
