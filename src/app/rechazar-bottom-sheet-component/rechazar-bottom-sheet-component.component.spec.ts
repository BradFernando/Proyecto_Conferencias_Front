import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechazarBottomSheetComponentComponent } from './rechazar-bottom-sheet-component.component';

describe('RechazarBottomSheetComponentComponent', () => {
  let component: RechazarBottomSheetComponentComponent;
  let fixture: ComponentFixture<RechazarBottomSheetComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RechazarBottomSheetComponentComponent]
    });
    fixture = TestBed.createComponent(RechazarBottomSheetComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
