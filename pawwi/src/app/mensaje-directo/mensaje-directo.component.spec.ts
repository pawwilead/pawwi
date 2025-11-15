import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeDirectoComponent } from './mensaje-directo.component';

describe('MensajeDirectoComponent', () => {
  let component: MensajeDirectoComponent;
  let fixture: ComponentFixture<MensajeDirectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeDirectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeDirectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
