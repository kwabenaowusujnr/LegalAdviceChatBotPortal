import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPromptModalComponent } from './signup-prompt-modal.component';

describe('SignupPromptModalComponent', () => {
  let component: SignupPromptModalComponent;
  let fixture: ComponentFixture<SignupPromptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupPromptModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupPromptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
