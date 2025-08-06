import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Navbar.css";

const Navbar = ({
  searchTerm,
  setSearchTerm,
  notes,
  onSelectNote,
  setShowSavedNotes,
}) => {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [debouncedTerm, setDebouncedTerm] = useState(localSearch);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  useEffect(() => {
    setSearchTerm(debouncedTerm);
  }, [debouncedTerm, setSearchTerm]);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(debouncedTerm.toLowerCase())
  );

  const handleLogout = () => {
    confirmAlert({
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            localStorage.removeItem("token");
            navigate("/");
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleNoteClick = (note) => {
    onSelectNote(note);
    setLocalSearch("");
    setSearchTerm("");
    setShowDropdown(false);
    setMenuOpen(false);
    setShowSavedNotes(false);
  };

  const handleShowAllNotes = () => {
    setSearchTerm("");
    setShowDropdown(false);
    onSelectNote(null);
    setMenuOpen(false);
    setShowSavedNotes((prev) => !prev);
  };

  return (
    <nav className={`navbar ${menuOpen ? "show-mobile-actions" : ""}`}>
      <div className="navbar-left" onClick={() => navigate("/dashboard")}>
        📝 Notes App
      </div>

      <div className="navbar-right">
        {/* 🔁 Search bar */}
        <div className="navbar-search-container">
          <input
            type="text"
            className="navbar-search search-input"
            placeholder="Search notes..."
            value={localSearch}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <span
              className="clear-search"
              onMouseDown={() => setLocalSearch("")}
            >
              ⨯
            </span>
          )}
          {showDropdown && debouncedTerm && filteredNotes.length > 0 && (
            <ul className="search-dropdown">
              {filteredNotes.slice(0, 5).map((note) => (
                <li key={note._id} onMouseDown={() => handleNoteClick(note)}>
                  {note.title || "Untitled"}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔁 Action buttons */}
        <div className={`navbar-actions ${menuOpen ? "open" : ""}`}>
          <button onClick={handleShowAllNotes}>Notes</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>

        {/* 🔁 Toggle menu icon */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "⨯" : "☰"}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
