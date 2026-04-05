import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 笔记类型定义
interface Note {
  title: string;
  fileName: string;
  path: string;
}

const NotesList = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 导航到笔记详情页
  const navigateToNote = (fileName: string) => {
    navigate(`/note/${fileName}`);
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
            className="note-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigateToNote(note.fileName)}
          >
            <div className="icon">📝</div>
            <h3>{note.title}</h3>
            <div className="tag-cute">点击查看</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;