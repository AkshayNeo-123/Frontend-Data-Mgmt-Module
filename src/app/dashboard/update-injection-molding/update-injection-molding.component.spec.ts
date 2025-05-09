import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInjectionMoldingComponent } from './update-injection-molding.component';

describe('UpdateInjectionMoldingComponent', () => {
  let component: UpdateInjectionMoldingComponent;
  let fixture: ComponentFixture<UpdateInjectionMoldingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInjectionMoldingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateInjectionMoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
