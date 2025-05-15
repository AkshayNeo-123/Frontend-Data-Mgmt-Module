import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipedetailsComponent } from './recipedetails.component';

describe('RecipedetailsComponent', () => {
  let component: RecipedetailsComponent;
  let fixture: ComponentFixture<RecipedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipedetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
