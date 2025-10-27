import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig";
import styles from "./EditQuestionPage.module.css"; // ✅ CSS module import

const EditQuestionPage = () => {
  const { questionid } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!questionid) {
      setError("No Question ID provided in URL");
      setLoading(false);
      return;
    }

    async function fetchQuestion() {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/question/${questionid}`, {
          headers: { Authorization: "Bearer " + token },
        });

        const q = res.data.data;
        setTitle(q.title);
        setTag(q.tag);
        setDescription(q.description);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [questionid]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(
        `/question/${questionid}`,
        { title, tag, description },
        { headers: { Authorization: "Bearer " + token } }
      );
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Failed to update question");
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Question</h2>
      <input
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Question title"
      />
      <input
        className={styles.input}
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tag (e.g. javascript)"
      />
      <textarea
        className={styles.textarea}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        placeholder="Question description"
      />
      <button className={styles.updateBtn} onClick={handleUpdate}>
        Update Question
      </button>
    </div>
  );
};

export default EditQuestionPage;
