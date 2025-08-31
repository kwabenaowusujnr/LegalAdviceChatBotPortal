import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputV2Component } from './chat-input-v2.component';

describe('ChatInputV2Component', () => {
  let component: ChatInputV2Component;
  let fixture: ComponentFixture<ChatInputV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInputV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatInputV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
