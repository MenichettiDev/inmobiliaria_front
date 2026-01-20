import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CboFuentesContactoComponent } from './cbo-fuentes-contacto.component';

describe('CboFuentesContactoComponent', () => {
  let component: CboFuentesContactoComponent;
  let fixture: ComponentFixture<CboFuentesContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CboFuentesContactoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CboFuentesContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
