import type { ChatSource, ChatStatus } from '@/types/chat';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api';

export async function getChatStatus(): Promise<ChatStatus> {
  const res = await fetch(`${API_BASE}/chat/status`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Chat status error: ${res.status}`);
  return res.json();
}

export async function streamChat(
  question: string,
  onSources: (sources: ChatSource[]) => void,
  onToken: (token: string) => void,
  onDone: () => void,
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) throw new Error(`Chat error: ${res.status}`);
  if (!res.body) throw new Error('No response body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const jsonStr = line.slice(6).trim();
      if (!jsonStr) continue;

      try {
        const data = JSON.parse(jsonStr);
        if (data.sources) {
          onSources(data.sources);
        } else if (data.token) {
          onToken(data.token);
        } else if (data.done) {
          onDone();
          return;
        }
      } catch {
        // skip malformed JSON
      }
    }
  }
  onDone();
}
