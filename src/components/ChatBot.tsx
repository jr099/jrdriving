import { MessageCircle, X, Send } from 'lucide-react';
import { useState } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: 'Bonjour! Je suis l\'assistant virtuel de jrdriving. Comment puis-je vous aider aujourd\'hui?', isBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, isBot: false }]);

    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = '';

      if (lowerInput.includes('devis') || lowerInput.includes('tarif') || lowerInput.includes('prix')) {
        response = 'Pour obtenir un devis personnalisé, je vous invite à remplir notre formulaire en ligne. Cela ne prend que quelques minutes et vous recevrez une estimation rapidement!';
      } else if (lowerInput.includes('mission') || lowerInput.includes('suivi')) {
        response = 'Vous pouvez suivre votre mission en temps réel depuis votre espace client. Si vous n\'avez pas encore de compte, je peux vous aider à en créer un!';
      } else if (lowerInput.includes('service') || lowerInput.includes('convoyage')) {
        response = 'Nous proposons du convoyage automobile B2B (loueurs, garages, concessions) et B2C (particuliers). Nous assurons des transports express et multi-étapes partout en France!';
      } else if (lowerInput.includes('contact') || lowerInput.includes('téléphone') || lowerInput.includes('email')) {
        response = 'Vous pouvez nous contacter par email à contact@jrdriving.galaxjr.digital ou par téléphone au +33 1 23 45 67 89. Notre équipe est disponible du lundi au vendredi de 8h à 18h.';
      } else if (lowerInput.includes('chauffeur') || lowerInput.includes('devenir')) {
        response = 'Vous souhaitez rejoindre notre équipe de chauffeurs? Excellent! Contactez-nous pour connaître les conditions et les démarches à suivre.';
      } else {
        response = 'Je suis là pour vous aider! Vous pouvez me poser des questions sur nos services, demander un devis, suivre une mission ou nous contacter. Comment puis-je vous assister?';
      }

      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    }, 1000);

    setInput('');
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="font-semibold">Assistant jrdriving</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-slate-700 p-1 rounded transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-orange-600 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSend}
                className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
