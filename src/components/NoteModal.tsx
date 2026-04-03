import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NoteModal({ content, onClose }: { content: string; onClose: () => void }) {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (content.startsWith('/notes/')) {
      fetch(content)
        .then(res => res.text())
        .then(text => setMarkdown(text));
    }
  }, [content]);

  if (!content.startsWith('/notes/')) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pink-200" onClick={onClose} />
      <div className="relative bg-[rgba(243,244,244,1)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-10 h-10 rounded-full bg-pink-100 text-black flex items-center justify-center text-xl"
        >
          ×
        </button>
    
        <div className="text-black markdown-body"> 
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}