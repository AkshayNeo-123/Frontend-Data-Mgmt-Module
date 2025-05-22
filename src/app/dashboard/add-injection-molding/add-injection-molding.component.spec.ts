import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInjectionMoldingComponent } from './add-injection-molding.component';

describe('AddInjectionMoldingComponent', () => {
  let component: AddInjectionMoldingComponent;
  let fixture: ComponentFixture<AddInjectionMoldingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInjectionMoldingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInjectionMoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
