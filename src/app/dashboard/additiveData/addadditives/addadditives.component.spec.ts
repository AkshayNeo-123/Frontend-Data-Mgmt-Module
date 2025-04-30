import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddadditivesComponent } from './addadditives.component';

describe('AddadditivesComponent', () => {
  let component: AddadditivesComponent;
  let fixture: ComponentFixture<AddadditivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddadditivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddadditivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
