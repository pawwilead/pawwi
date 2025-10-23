import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarPawwerComponent } from './agendar-pawwer.component';

describe('AgendarPawwerComponent', () => {
  let component: AgendarPawwerComponent;
  let fixture: ComponentFixture<AgendarPawwerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarPawwerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarPawwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
