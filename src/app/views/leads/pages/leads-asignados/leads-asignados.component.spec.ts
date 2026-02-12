import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsAsignadosComponent } from './leads-asignados.component';

describe('LeadsAsignadosComponent', () => {
  let component: LeadsAsignadosComponent;
  let fixture: ComponentFixture<LeadsAsignadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsAsignadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsAsignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
