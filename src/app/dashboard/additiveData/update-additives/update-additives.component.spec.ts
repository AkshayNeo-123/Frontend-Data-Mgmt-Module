import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdditivesComponent } from './update-additives.component';

describe('UpdateAdditivesComponent', () => {
  let component: UpdateAdditivesComponent;
  let fixture: ComponentFixture<UpdateAdditivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAdditivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAdditivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
