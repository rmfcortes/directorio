import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBazarPage } from './lista-bazar.page';

describe('ListaBazarPage', () => {
  let component: ListaBazarPage;
  let fixture: ComponentFixture<ListaBazarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaBazarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaBazarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
