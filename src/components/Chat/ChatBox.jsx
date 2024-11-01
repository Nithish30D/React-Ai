import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDaxIeDQpfWqVMhZeTBfd1IQyrbn2DwKZI");

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        
      });

      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{text : msg.text}],
        })),
      });
      
      const result = await chat.sendMessage(userMessage.text);
      const response = await result.response.text();
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'AI', text: response }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          sender: 'AI', 
          text: "Sorry, I encountered an error. Please try again." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-full h-[90dvh] flex flex-col border-t-indigo-30050 bg-black p-5">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-violet-400 font-bold p-20">
            Chat to start writing, planning, learning and more with REACT-AI BOT
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'border-t-orange-300 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-pink-800  p-3 rounded-lg">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex gap-2 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything...."
          className="py-2 px-5  bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-70"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="p-2 bg-yellow-300 text-white rounded-lg hover:bg-red-400 disabled:bg-blue-300 disabled:cursor-not-allowed">        
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;