import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, Bot } from "lucide-angular"

@Component({
  selector: 'app-typing-indicator',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './typing-indicator.component.html',
  styleUrl: './typing-indicator.component.css'
})
export class TypingIndicatorComponent {
  botIcon = Bot
}
