import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmainpolymerComponent } from './addmainpolymer.component';

describe('AddmainpolymerComponent', () => {
  let component: AddmainpolymerComponent;
  let fixture: ComponentFixture<AddmainpolymerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmainpolymerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmainpolymerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
