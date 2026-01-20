import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CboRolesComponent } from './cbo-roles.component';

describe('CboRolesComponent', () => {
  let component: CboRolesComponent;
  let fixture: ComponentFixture<CboRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CboRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CboRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
