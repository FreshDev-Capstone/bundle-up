import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiClient } from '../../lib/apiClient';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Mobile app is currently SFI-only.
  const variant = 'sfi' as const;

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'greeting',
      role: 'assistant',
      text: 'Hi! I’m Bundle Up Support. How can I help today?',
    },
  ]);

  const scrollRef = useRef<ScrollView | null>(null);

  const canSend = useMemo(() => !!draft.trim() && !isSending, [draft, isSending]);

  async function send() {
    if (!canSend) return;

    const text = draft.trim();
    const userMessage: ChatMessage = { id: `${Date.now()}-user`, role: 'user', text };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsSending(true);

    const res = await apiClient.supportChat({ message: text, context: { variant } });

    const replyText = res.success
      ? res.data.reply
      : res.message || 'Sorry — something went wrong. Please try again.';

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-assistant`, role: 'assistant', text: replyText },
    ]);

    setIsSending(false);

    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }

  return (
    <>
      <Pressable style={styles.fab} onPress={() => setIsOpen(true)} accessibilityLabel="Open chat">
        <Text style={styles.fabText}>Chat</Text>
      </Pressable>

      <Modal visible={isOpen} animationType="slide" onRequestClose={() => setIsOpen(false)}>
        <KeyboardAvoidingView
          style={styles.modal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Customer Support</Text>
            </View>
            <Pressable onPress={() => setIsOpen(false)} accessibilityLabel="Close chat">
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={(r) => {
              scrollRef.current = r;
            }}
            contentContainerStyle={styles.messages}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((m) => (
              <View
                key={m.id}
                style={[styles.bubbleRow, m.role === 'user' ? styles.rowRight : styles.rowLeft]}
              >
                <View
                  style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.botBubble]}
                >
                  <Text style={m.role === 'user' ? styles.userText : styles.botText}>{m.text}</Text>
                </View>
              </View>
            ))}
            {isSending && (
              <View style={[styles.bubbleRow, styles.rowLeft]}>
                <View style={[styles.bubble, styles.botBubble]}>
                  <Text style={styles.botText}>Typing…</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.composer}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Type a message…"
              style={styles.input}
              editable={!isSending}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <Pressable
              style={[styles.sendBtn, !canSend ? styles.sendBtnDisabled : null]}
              onPress={send}
              disabled={!canSend}
              accessibilityLabel="Send message"
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#16a34a',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    zIndex: 50,
  },
  fabText: {
    color: 'white',
    fontWeight: '700',
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  close: {
    fontSize: 20,
    color: '#6b7280',
  },
  messages: {
    padding: 16,
    gap: 10,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#111827',
  },
  botBubble: {
    backgroundColor: '#f3f4f6',
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#1f2937',
  },
  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
  },
  sendBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: 'white',
    fontWeight: '700',
  },
});
