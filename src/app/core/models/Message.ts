export interface Message {
  id: string
  sender: "user" | "ai"
  content: string
  timestamp: string
  feedback?: "good" | "bad" | "custom"
}
