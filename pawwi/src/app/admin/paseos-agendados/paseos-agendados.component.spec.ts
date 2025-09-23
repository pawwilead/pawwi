import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaseosAgendadosComponent } from './paseos-agendados.component';

describe('PaseosAgendadosComponent', () => {
  let component: PaseosAgendadosComponent;
  let fixture: ComponentFixture<PaseosAgendadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaseosAgendadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaseosAgendadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
