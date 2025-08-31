export interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  timestamp: string
  feedback?: "good" | "bad" | "custom"
}


export interface ChatMessage {
  id: number
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export interface NavigationItem {
  label: string
  icon?: any
  isActive?: boolean
}

export interface NavigationSection {
  title: string
  items: NavigationItem[]
  isCollapsible?: boolean
  isExpanded?: boolean
}