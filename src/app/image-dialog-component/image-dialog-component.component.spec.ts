import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDialogComponentComponent } from './image-dialog-component.component';

describe('ImageDialogComponentComponent', () => {
  let component: ImageDialogComponentComponent;
  let fixture: ComponentFixture<ImageDialogComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageDialogComponentComponent]
    });
    fixture = TestBed.createComponent(ImageDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
