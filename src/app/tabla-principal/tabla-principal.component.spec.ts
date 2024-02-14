import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPrincipalComponent } from './tabla-principal.component';

describe('TablaPrincipalComponent', () => {
  let component: TablaPrincipalComponent;
  let fixture: ComponentFixture<TablaPrincipalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaPrincipalComponent]
    });
    fixture = TestBed.createComponent(TablaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
