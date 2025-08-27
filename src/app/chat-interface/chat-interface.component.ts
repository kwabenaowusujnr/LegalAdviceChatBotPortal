import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ChatAreaComponent } from "../chat-area/chat-area.component";

@Component({
  selector: 'app-chat-interface',
  imports: [SidebarComponent, ChatAreaComponent],
  templateUrl: './chat-interface.component.html',
  styleUrl: './chat-interface.component.css'
})
export class ChatInterfaceComponent {

}
