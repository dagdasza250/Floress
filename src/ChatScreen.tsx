import React, { useState } from 'react';
import { callGemini, Message } from './gemini';
import { saveConversation } from './firestore';

interface Props {
  appId: string;
  uid: string;
}

const ChatScreen: React.FC<Props> = ({ appId, uid }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    try {
      const reply = await callGemini(history);
      const botMsg: Message = { role: 'model', text: reply.text };
      const fullHistory = [...history, botMsg];
      setMessages(fullHistory);
      await saveConversation(appId, uid, fullHistory);
      if (reply.crisis) {
        console.warn('KRYZYS_WYKRYTY');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-screen">
      <div className="messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.role}`}>
            {m.text}
          </div>
        ))}
      </div>
      <textarea
        rows={3}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} disabled={loading}>
        Send
      </button>
    </div>
  );
};

export default ChatScreen;
