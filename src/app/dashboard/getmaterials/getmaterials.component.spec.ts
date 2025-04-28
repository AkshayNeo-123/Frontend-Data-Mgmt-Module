import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetmaterialsComponent } from './getmaterials.component';

describe('GetmaterialsComponent', () => {
  let component: GetmaterialsComponent;
  let fixture: ComponentFixture<GetmaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetmaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetmaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
