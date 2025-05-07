import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompoundingComponent } from './add-compounding.component';

describe('AddCompoundingComponent', () => {
  let component: AddCompoundingComponent;
  let fixture: ComponentFixture<AddCompoundingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCompoundingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompoundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
