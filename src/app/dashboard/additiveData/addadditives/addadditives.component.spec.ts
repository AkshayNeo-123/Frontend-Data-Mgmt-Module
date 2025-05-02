import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdditiveComponent } from './addadditives.component';

describe('AddadditivesComponent', () => {
  let component: AddAdditiveComponent;
  let fixture: ComponentFixture<AddAdditiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdditiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdditiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
