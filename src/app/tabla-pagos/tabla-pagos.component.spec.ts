import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPagosComponent } from './tabla-pagos.component';

describe('TablaPagosComponent', () => {
  let component: TablaPagosComponent;
  let fixture: ComponentFixture<TablaPagosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaPagosComponent]
    });
    fixture = TestBed.createComponent(TablaPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
