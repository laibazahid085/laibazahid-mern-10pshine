import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "../components/Navbar"; // Adjust path as needed
import { BrowserRouter } from "react-router-dom";

// Mocks for props
const mockSetSearchTerm = jest.fn();
const mockOnSelectNote = jest.fn();
const mockSetShowSavedNotes = jest.fn();

const notes = [
  { _id: "1", title: "First Note" },
  { _id: "2", title: "Second Note" },
  { _id: "3", title: "React Testing" },
];

const renderNavbar = () => {
  render(
    <BrowserRouter>
      <Navbar
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
        notes={notes}
        onSelectNote={mockOnSelectNote}
        setShowSavedNotes={mockSetShowSavedNotes}
      />
    </BrowserRouter>
  );
};

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Navbar and buttons", () => {
    renderNavbar();

    expect(screen.getByText(/notes app/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search notes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  test("filters and displays matching notes in dropdown", async () => {
    renderNavbar();

    const searchInput = screen.getByPlaceholderText(/search notes/i);
    fireEvent.change(searchInput, { target: { value: "react" } });
    fireEvent.focus(searchInput);

    await waitFor(() => {
      expect(screen.getByText("React Testing")).toBeInTheDocument();
    });
  });

  test("clears search input when clear icon is clicked", () => {
    renderNavbar();

    const input = screen.getByPlaceholderText(/search notes/i);
    fireEvent.change(input, { target: { value: "test" } });

    const clearBtn = screen.getByText("⨯");
    fireEvent.mouseDown(clearBtn);

    expect(input.value).toBe(""); // React Testing Library doesn't auto-update controlled input value in test
  });

  test("clicking Logout removes token and navigates", () => {
    localStorage.setItem("token", "testToken");

    delete window.location;
    window.location = { href: "" };

    renderNavbar();

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    expect(localStorage.getItem("token")).toBeNull();
    expect(window.location.href).toBe("/");
  });

  test("clicking Notes button toggles saved notes", () => {
    renderNavbar();

    const notesBtn = screen.getByRole("button", { name: /notes/i });
    fireEvent.click(notesBtn);

    expect(mockSetShowSavedNotes).toHaveBeenCalled();
  });

  test("clicking on a note calls onSelectNote", async () => {
    renderNavbar();

    const input = screen.getByPlaceholderText(/search notes/i);
    fireEvent.change(input, { target: { value: "first" } });
    fireEvent.focus(input);

    const noteOption = await screen.findByText("First Note");
    fireEvent.mouseDown(noteOption);

    expect(mockOnSelectNote).toHaveBeenCalledWith(notes[0]);
  });
});
