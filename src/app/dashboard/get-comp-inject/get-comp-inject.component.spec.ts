import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCompInjectComponent } from './get-comp-inject.component';

describe('GetCompInjectComponent', () => {
  let component: GetCompInjectComponent;
  let fixture: ComponentFixture<GetCompInjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetCompInjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetCompInjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
