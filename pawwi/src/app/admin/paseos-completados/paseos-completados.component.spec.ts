import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaseosCompletadosComponent } from './paseos-completados.component';

describe('PaseosCompletadosComponent', () => {
  let component: PaseosCompletadosComponent;
  let fixture: ComponentFixture<PaseosCompletadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaseosCompletadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaseosCompletadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
