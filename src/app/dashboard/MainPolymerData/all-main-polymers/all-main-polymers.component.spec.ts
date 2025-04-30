import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMainPolymersComponent } from './all-main-polymers.component';

describe('AllMainPolymersComponent', () => {
  let component: AllMainPolymersComponent;
  let fixture: ComponentFixture<AllMainPolymersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMainPolymersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMainPolymersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
