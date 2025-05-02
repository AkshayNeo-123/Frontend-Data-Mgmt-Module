import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllAdditivesComponent } from './get-all-additives.component';

describe('GetAllAdditivesComponent', () => {
  let component: GetAllAdditivesComponent;
  let fixture: ComponentFixture<GetAllAdditivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllAdditivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllAdditivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
