import { useEffect, useState } from "react";
import styles from "@/styles/noteModal.module.css";

export default function NoteModal({ onSave, onClose, isOpen, initialData }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    getInitialData();
  }, [initialData]);
  const getInitialData= async ()=>{
 
    setTitle(initialData.title)
    setContent(initialData.content)
    setId(initialData.id)
 
  }
  const handleSave = async () => {
    setTitle("");
    setContent("");
    await onSave({id, title, content });
    
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Add New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.modalInput}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.modalTextarea}
        />
        <div className={styles.modalActions}>
          <button onClick={handleSave} className={styles.modalSave}>Save</button>
          <button onClick={onClose} className={styles.modalCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
