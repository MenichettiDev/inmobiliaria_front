import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CboClientesComponent } from './cbo-clientes.component';

describe('CboClientesComponent', () => {
  let component: CboClientesComponent;
  let fixture: ComponentFixture<CboClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CboClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CboClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
