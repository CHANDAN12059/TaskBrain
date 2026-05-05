import { useState } from "react";
import axios from "axios";

function CreateTasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
    "https://taskbrain-ugbn.onrender.com/create",
        {
          title,
          description,
          priority,
          dueDate,
          assignedTo: [assignedTo],
        },
        { withCredentials: true }
      );

      alert("Task created successfully");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Error creating task");
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
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
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Assign To </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
      </form>
    </div>
  );
}

export default CreateTasks;
