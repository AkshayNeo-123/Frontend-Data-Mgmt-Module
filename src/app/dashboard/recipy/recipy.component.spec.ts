import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipyComponent } from './recipy.component';

describe('RecipyComponent', () => {
  let component: RecipyComponent;
  let fixture: ComponentFixture<RecipyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
