import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams, useNavigate } from "react-router-dom";

const NoteDetail = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fileName) {
      const loadNoteContent = async () => {
        try {
          // 直接使用 fileName 构建文件路径
          const res = await fetch(`/notes/${fileName}.md`);
          if (!res.ok) {
            throw new Error("笔记文件不存在");
          }
          const noteContent = await res.text();
          setContent(noteContent);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : "加载笔记失败");
        } finally {
          setLoading(false);
        }
      };

      loadNoteContent();
    }
  }, [fileName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">正在加载笔记...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-destructive text-lg">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => navigate("/")}
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          className="mb-6 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          ← 返回笔记列表
        </button>
        <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;