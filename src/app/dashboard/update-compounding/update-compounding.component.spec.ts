import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompoundingComponent } from './update-compounding.component';

describe('UpdateCompoundingComponent', () => {
  let component: UpdateCompoundingComponent;
  let fixture: ComponentFixture<UpdateCompoundingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompoundingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompoundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
