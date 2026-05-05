import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BASE_URL = "https://taskbrain-ugbn.onrender.com";

function UpdateStatus() {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await axios.get(
          `${BASE_URL}/task/${id}`,
          { withCredentials: true }
        );
        setTask(res.data);
        setStatus(res.data.status);
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
        { status },
        { withCredentials: true }
      );

      alert("Status updated successfully");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Error updating status");
    }
  }

  if (!task) return <h2>Loading...</h2>;

  return (
    <div className="container mt-5">
      <h2>Update Task Status</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-control"
            value={task.title}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={task.description}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Priority</label>
          <input
            type="text"
            className="form-control"
            value={task.priority}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            value={task.dueDate?.split("T")[0]}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Assigned To</label>
          <input
            type="text"
            className="form-control"
            value={task.assignedTo}
            disabled
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

        <button type="submit" className="btn btn-primary">
          Update Status
        </button>

      </form>
    </div>
  );
}

export default UpdateStatus;