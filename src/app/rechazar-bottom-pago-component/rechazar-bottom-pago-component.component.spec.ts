import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechazarBottomPagoComponentComponent } from './rechazar-bottom-pago-component.component';

describe('RechazarBottomPagoComponentComponent', () => {
  let component: RechazarBottomPagoComponentComponent;
  let fixture: ComponentFixture<RechazarBottomPagoComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RechazarBottomPagoComponentComponent]
    });
    fixture = TestBed.createComponent(RechazarBottomPagoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
