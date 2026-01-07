import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorIntegracionesComponent } from './visor-integraciones.component';

describe('VisorIntegracionesComponent', () => {
  let component: VisorIntegracionesComponent;
  let fixture: ComponentFixture<VisorIntegracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorIntegracionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorIntegracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
