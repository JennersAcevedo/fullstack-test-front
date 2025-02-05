"use client";
import styles from "@/styles/home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/guessNavbar/guessNavbar";
import { useRouter } from "next/navigation";
import NoteModal from "@/components/noteModal/NoteModal";


export default function Notes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[initialData, setInitialData]= useState({"id":0,"title":"", "content":""})
  const router = useRouter();

  // I'm saving the token on the cookies to keep the
  //  session for this reason I need to read the cookie after make a request
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    async function tokenValidation() {
      let token = getCookie("authToken");
      if (!token) {
        router.push("/login");
      } 
    }
    tokenValidation();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let token = getCookie("authToken");
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const datesResponse = await axios.get(
        "http://localhost:4000/notes",
        config
      );
      if (datesResponse.data.success) {
        setData(datesResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleApiDelete = async (id) => {
    try {
      let token = getCookie("authToken")
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const updateResponse = await axios.delete(
        `http://localhost:4000/notes/delete/${id}`,
        config
      );
      if (updateResponse.data.data) {
        const newNote = await updateResponse;
        setData((prevNotes) => prevNotes.filter((note) => note.id !== id));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error reaching the API");
    }
  };
  const handleSaveNote = async (note) => {
    let token = getCookie("authToken");
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    let body = {
      note_content: note.content,
      note_title: note.title,
    };
    // if note.id is equal to 0 it's supposed to be save workflow
    if (note.id ===0) {
      const updateResponse = await axios.post(
        `http://localhost:4000/notes/add/note`,
        body,
        config
      );
      if (updateResponse.data.data) {
        const newNote = updateResponse.data.data;
        setData((prevData) =>[...prevData, newNote]);
        setIsModalOpen(false);
      }
    }else{
      //Handle update
      const updateResponse = await axios.put(
        `http://localhost:4000/notes/update/${note.id}`,
        body,
        config
      );
      if (updateResponse.data.data) {
        const newNote = updateResponse;
        setData((prevData) =>
          prevData.map((item) =>
            item.id === note.id ? updateResponse.data.data : item
          )
        );
        setIsModalOpen(false);
      }
    }
    
  };

  const handleModal = async () => {
    try {
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error reaching the Modal");
    }
  };

  const handleModalUpdate = async (id, title, content) => {
    try {
      setInitialData({"id":id,"title":title, "content":content})
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error reaching the Modal");
    }
  };
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Notes</h1>
        <NoteModal
          onSave={handleSaveNote}
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          initialData={initialData}
        />
        {loading && <p>Loading...</p>}
        <div className={styles.cardGrid}>
          <button onClick={() => handleModal()} className={styles.button}>
            Add note
          </button>
          {data.map((item) => (
            <div  key={item.id}className={styles.cardContainer}>
              <div key={item.id} className={styles.card}>
                <div className={styles.noteData}>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <p>{item.content}</p>
                </div>
              </div>

              <button
                onClick={() => handleModalUpdate(item.id, item.title, item.content)}
                className={styles.button}
              >
                Update
              </button>
              <button
                onClick={() => handleApiDelete(item.id)}
                className={styles.button}
              >
                Delete
              </button>
            </div>
          ))}
        </div> 
        <div className={styles.author}>
        <p>Created by: Jenners Acevedo Berg</p>
        <p>Email: jenners.acevedo@gmail.com</p>
        </div>
        
      </div>
     
    </div>
  );
}
