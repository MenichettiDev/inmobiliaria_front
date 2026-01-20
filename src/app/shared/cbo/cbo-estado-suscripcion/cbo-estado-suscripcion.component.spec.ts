import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CboEstadoSuscripcionComponent } from './cbo-estado-suscripcion.component';

describe('CboEstadoSuscripcionComponent', () => {
  let component: CboEstadoSuscripcionComponent;
  let fixture: ComponentFixture<CboEstadoSuscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CboEstadoSuscripcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CboEstadoSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
