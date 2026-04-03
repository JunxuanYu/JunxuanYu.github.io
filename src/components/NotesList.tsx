import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 笔记类型定义
interface Note {
  title: string;
  fileName: string;
  path: string;
}

const NotesList = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  // 加载笔记内容
  const loadNoteContent = async (path: string) => {
    const res = await fetch(path);
    const content = await res.text();
    setSelectedContent(content);
    setShowModal(true);
  };

  // 读取笔记列表
  useEffect(() => {
    fetch("/notes/files.json")
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("加载笔记失败：", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">正在加载你的学习笔记...</div>;
  }

  return (
    <div className="notes-page">
      <h2>📚 我的学习笔记</h2>
      <div className="notes-grid">
        {notes.map((note, index) => (
          <div
            key={index}
            className="note-card"
            onClick={() => loadNoteContent(note.path)}
          >
            <div className="icon">📝</div>
            <h3>{note.title}</h3>
            <div className="tag-cute">点击查看</div>
          </div>
        ))}
      </div>

      {/* 弹窗显示笔记内容 */}
      {showModal && (
        <div className="note-modal">
          <div className="modal-overlay" onClick={() => setShowModal(false)} />
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;