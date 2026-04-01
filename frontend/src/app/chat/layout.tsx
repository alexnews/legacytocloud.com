import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat with News',
  description:
    'Ask questions about cloud computing, data engineering, and AI news using our RAG-powered chat. Answers grounded in real articles.',
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
