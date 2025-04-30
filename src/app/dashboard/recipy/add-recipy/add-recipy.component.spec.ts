import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipyComponent } from './add-recipy.component';

describe('AddRecipyComponent', () => {
  let component: AddRecipyComponent;
  let fixture: ComponentFixture<AddRecipyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecipyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecipyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
