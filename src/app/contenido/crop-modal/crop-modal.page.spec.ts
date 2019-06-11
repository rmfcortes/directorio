import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropModalPage } from './crop-modal.page';

describe('CropModalPage', () => {
  let component: CropModalPage;
  let fixture: ComponentFixture<CropModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
