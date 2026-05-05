import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BASE_URL = "https://taskbrain-ugbn.onrender.com";

function UpdateAdminStatus() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await axios.get(
          `${BASE_URL}/task/${id}`,
          { withCredentials: true }
        );

        const task = res.data;

        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setDueDate(task.dueDate?.split("T")[0]);
        setAssignedTo(task.assignedTo);
        setStatus(task.status);

      } catch (err) {
        console.log(err);
      }
    }

    fetchTask();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.put(
        `${BASE_URL}/task/${id}`,
        {
          title,
          description,
          priority,
          dueDate,
          assignedTo,
          status,
        },
        { withCredentials: true }
      );

      alert("Task updated successfully");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Error updating task");
    }
  }

  return (
    <div className="container mt-5">
      <h2>Edit Task (Admin)</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Assigned To (username)</label>
          <input
            type="text"
            className="form-control"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button className="btn btn-success">
          Update Task
        </button>

      </form>
    </div>
  );
}

export default UpdateAdminStatus;