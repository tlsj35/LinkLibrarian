import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "http://linklibrarian-backend-env.eba-fnyxdkdp.us-west-2.elasticbeanstalk.com";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  };

  const loadLinks = async () => {
    try {
      const res = await axios.get(`${API_URL}/links`, getAuthHeaders());
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearForm = () => {
    setTitle("");
    setUrl("");
    setNotes("");
    setTags("");
    setEditingId(null);
  };

  const saveLink = async (e) => {
    e.preventDefault();

    let formattedUrl = url.trim();

    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/links/${editingId}`,
          { title, url: formattedUrl, notes, tags },
          getAuthHeaders()
        );
      } else {
        await axios.post(
          `${API_URL}/links`,
          { title, url: formattedUrl, notes, tags },
          getAuthHeaders()
        );
      }

      clearForm();
      loadLinks();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const editLink = (link) => {
    setEditingId(link.id);
    setTitle(link.title);
    setUrl(link.url);
    setNotes(link.notes || "");
    setTags(link.tags || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteLink = async (id) => {
    try {
      await axios.delete(`${API_URL}/links/${id}`, getAuthHeaders());
      loadLinks();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const filteredLinks = links.filter((link) =>
    `${link.title} ${link.url} ${link.notes} ${link.tags}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="logo">LinkLibrarian</div>

        <div className="nav-links">
          <a href="/links">Links</a>
          <a href="#new-link">New Link</a>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="page">
        <h1 className="hero-title">Your curated corner of the web.</h1>

        <p className="hero-subtitle">
          Save articles, tools, references, and ideas in one warm little library.
        </p>

        <form id="new-link" className="form-card" onSubmit={saveLink}>
          <h2>{editingId ? "Edit Link" : "New Link"}</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="google.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <button type="submit">
            {editingId ? "Update Link" : "Save Link"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              style={{ marginLeft: "1rem" }}
            >
              Cancel
            </button>
          )}
        </form>

        <div style={{ maxWidth: "420px", marginTop: "2rem" }}>
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card-grid">
          {filteredLinks.map((link) => (
            <div className="link-card" key={link.id}>
              <h2>{link.title}</h2>

              <a href={link.url} target="_blank" rel="noreferrer">
                {link.url}
              </a>

              <p className="notes">{link.notes}</p>

              <div>
                {link.tags?.split(",").map((tag, index) => (
                  <span className="tag" key={index}>
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => editLink(link)}
                  style={{ marginRight: "0.5rem" }}
                >
                  Edit
                </button>

                <button onClick={() => deleteLink(link.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}