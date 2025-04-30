import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAdditiveComponent } from './delete-additive.component';

describe('DeleteAdditiveComponent', () => {
  let component: DeleteAdditiveComponent;
  let fixture: ComponentFixture<DeleteAdditiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAdditiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAdditiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
