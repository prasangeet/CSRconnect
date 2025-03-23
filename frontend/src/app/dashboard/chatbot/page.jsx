"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Bot, User, RefreshCw } from "lucide-react"

function ChatBotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your SDG Research Assistant. How can I help you today?",
      sender: "bot",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Simulate sending a message and getting a response
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate bot typing
    setIsTyping(true)

    // Simulate API call delay
    setTimeout(() => {
      // Sample responses based on keywords
      let botResponse = "I'm not sure how to respond to that. Could you try asking about SDGs or faculty research?"

      const userText = inputMessage.toLowerCase()

      if (userText.includes("sdg") || userText.includes("sustainable")) {
        botResponse =
          "The Sustainable Development Goals (SDGs) are 17 global goals designed to be a blueprint for achieving a better and more sustainable future for all. Our faculty members contribute to various SDGs through their research and teaching."
      } else if (userText.includes("faculty") || userText.includes("professor")) {
        botResponse =
          "Our faculty members are experts in various fields and contribute to sustainable development through their research. You can view their profiles in the Faculty Directory."
      } else if (userText.includes("research") || userText.includes("area")) {
        botResponse =
          "Our faculty conducts research in various areas including renewable energy, sustainable agriculture, climate action, and social equity. Each faculty profile shows their specific areas of work."
      } else if (userText.includes("hello") || userText.includes("hi")) {
        botResponse =
          "Hello! I'm here to help you learn about our faculty and their contributions to sustainable development. What would you like to know?"
      }

      const newBotMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
      }

      setMessages((prev) => [...prev, newBotMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  // Clear chat history
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your SDG Research Assistant. How can I help you today?",
        sender: "bot",
      },
    ])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-4">SDG Research Assistant</h1>
                <p className="text-primary-foreground/80 max-w-2xl">
                  Ask questions about our faculty's research and contributions to Sustainable Development Goals.
                </p>
              </div>
              <Button
                variant="outline"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20"
                onClick={handleClearChat}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>
          </div>
          <MessageCircle className="absolute right-4 bottom-4 w-64 h-64 text-primary-foreground/10" />
        </div>

        {/* Chat Container */}
        <div className="border rounded-xl shadow-sm mb-4 bg-card">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tl-xl rounded-bl-xl rounded-tr-xl"
                      : "bg-muted rounded-tr-xl rounded-br-xl rounded-tl-xl"
                  } p-3 shadow-sm`}
                >
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      {message.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div>{message.text}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex mb-4 justify-start">
                <div className="bg-muted rounded-tr-xl rounded-br-xl rounded-tl-xl p-3 shadow-sm">
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 mr-2" />
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 flex items-center">
            <Input
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 mr-2"
            />
            <Button onClick={handleSendMessage} disabled={inputMessage.trim() === ""}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Suggested Questions</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "What are SDGs?",
              "How do faculty contribute to SDGs?",
              "What research areas are covered?",
              "Tell me about faculty specializations",
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="mb-2"
                onClick={() => {
                  setInputMessage(question)
                }}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBotPage

