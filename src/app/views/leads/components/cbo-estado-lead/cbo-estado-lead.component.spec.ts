import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CboEstadoLeadComponent } from './cbo-estado-lead.component';

describe('CboEstadoLeadComponent', () => {
  let component: CboEstadoLeadComponent;
  let fixture: ComponentFixture<CboEstadoLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CboEstadoLeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CboEstadoLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
