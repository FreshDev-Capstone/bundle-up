import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Spinner } from '@bundle-up/ui';
import { apiClient } from '../../lib/apiClient';

type Variant = 'sfi' | 'nfi';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

function greeting(variant: Variant): string {
  return variant === 'nfi'
    ? 'Hi! I’m Bundle Up Support. How can I help with business ordering?'
    : 'Hi! I’m Bundle Up Support. How can I help today?';
}

export function SupportChatWidget({ variant }: { variant: Variant }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 'greeting', role: 'assistant', text: greeting(variant) },
  ]);

  const accentClassName = useMemo(
    () => (variant === 'nfi' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'),
    [variant],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If someone flips variant while staying in-app, reset the greeting.
    setMessages([{ id: 'greeting', role: 'assistant', text: greeting(variant) }]);
  }, [variant]);

  useEffect(() => {
    if (!isOpen) return;
    // Scroll to bottom when opened / message changes
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [isOpen, messages.length]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (isSending) return;

    const text = draft.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsSending(true);

    const res = await apiClient.supportChat({ message: text, context: { variant } });

    if (res.success) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: res.data.reply,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          text: res.message || 'Sorry — something went wrong. Please try again.',
        },
      ]);
    }

    setIsSending(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="mb-3 w-[340px] max-w-[calc(100vw-3rem)] rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Customer Support</p>
              <p className="text-xs text-gray-500">
                {variant === 'nfi' ? 'Business (B2B)' : 'Retail (B2C)'}
              </p>
            </div>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div ref={containerRef} className="max-h-[320px] overflow-auto px-4 py-3 space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-lg bg-gray-900 px-3 py-2 text-sm text-white'
                      : 'max-w-[85%] rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800'
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Typing…</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-200 p-3 flex items-end gap-2">
            <div className="flex-1">
              <Input
                label=""
                id="support_chat_input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
              />
            </div>
            <Button type="submit" disabled={isSending || !draft.trim()}>
              Send
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`rounded-full px-5 py-3 text-sm font-medium text-white shadow-sm ${accentClassName}`}
        aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
      >
        {isOpen ? 'Close' : 'Chat'}
      </button>
    </div>
  );
}
