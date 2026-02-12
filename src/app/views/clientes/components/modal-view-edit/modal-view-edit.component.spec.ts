import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewEditComponent } from './modal-view-edit.component';

describe('ModalViewEditComponent', () => {
  let component: ModalViewEditComponent;
  let fixture: ComponentFixture<ModalViewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalViewEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
