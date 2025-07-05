import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  const apiUrl = "http://localhost:8000";

  // Edit fields
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      try {
        const res = await fetch(apiUrl + "/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        });

        if (res.ok) {
          const newItem = await res.json();
          setTodos([...todos, newItem]);
          setMessage("Item added Successfully");
          setTitle("");
          setDescription("");
          setTimeout(() => {
            setMessage("");
          }, 2000);
        } else {
          setError("Unable to Create Todo Item");
        }
      } catch (err) {
        setError("Unable to Create Todo Item");
      }
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const res = await fetch(apiUrl + "/todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError("Unable to fetch Todo Items");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = async () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      try {
        const res = await fetch(apiUrl + "/todos/" + editId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
          }),
        });

        if (res.ok) {
          const updatedTodos = todos.map((item) => {
            if (item._id === editId) {
              return {
                ...item,
                title: editTitle,
                description: editDescription,
              };
            }
            return item;
          });

          setTodos(updatedTodos);
          setEditId(-1);
          setEditTitle("");
          setEditDescription("");
          setMessage("Item Updated Successfully");
          setTimeout(() => {
            setMessage("");
          }, 2000);
        } else {
          setError("Unable to Update Todo Item");
        }
      } catch (err) {
        setError("Unable to Update Todo Item");
      }
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await fetch(apiUrl + "/todos/" + id, {
          method: "DELETE",
        });
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      } catch (err) {
        setError("Unable to Delete Todo Item");
      }
    }
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>ToDO Project with MERN stack</h1>
      </div>

      <div className="row">
        <h3>Add Items</h3>
        {message && <p className="text-success">{message}</p>}

        <div className="form-group d-flex gap-2">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="form-control"
            type="text"
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
          <ul className="list-group">
            {todos.map((item) => (
              <li
                key={item._id}
                className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
              >
                <div className="d-flex flex-column me-2">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <span className="fw-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </>
                  ) : (
                    <div className="form-group d-flex gap-2">
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-warning" onClick={handleUpdate}>
                        Update
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
