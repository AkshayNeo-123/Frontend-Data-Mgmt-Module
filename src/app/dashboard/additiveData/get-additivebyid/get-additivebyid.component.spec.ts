import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAdditivebyidComponent } from './get-additivebyid.component';

describe('GetAdditivebyidComponent', () => {
  let component: GetAdditivebyidComponent;
  let fixture: ComponentFixture<GetAdditivebyidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAdditivebyidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAdditivebyidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
