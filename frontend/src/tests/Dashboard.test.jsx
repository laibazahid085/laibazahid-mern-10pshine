import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard"; // Adjust path as needed
import { BrowserRouter } from "react-router-dom";
import * as noteService from "../services/noteService";
import * as reactToastify from "react-toastify";

// Mocks
jest.mock("../services/noteService");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

const mockNotes = [
  { _id: "1", title: "Note One", content: "<p>Content One</p>" },
  { _id: "2", title: "Note Two", content: "<p>Content Two</p>" },
];

const renderDashboard = () =>
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("fetches and displays notes on mount", async () => {
    noteService.getNotes.mockResolvedValueOnce(mockNotes);

    renderDashboard();

    await waitFor(() => {
      expect(noteService.getNotes).toHaveBeenCalled();
    });
  });

  test("shows welcome toast if user signed up", async () => {
    localStorage.setItem("newlySignedUpUser", "TestUser");
    noteService.getNotes.mockResolvedValueOnce(mockNotes);

    renderDashboard();

    await waitFor(() => {
      expect(reactToastify.toast.success).toHaveBeenCalledWith("🎉 Welcome, TestUser!", expect.any(Object));
    });

    expect(localStorage.getItem("newlySignedUpUser")).toBe(null);
  });

  test("clicking create new note shows NoteEditor", async () => {
    noteService.getNotes.mockResolvedValueOnce([]);

    renderDashboard();

    const createBtn = await screen.findByRole("button", { name: /\+ create new note/i });
    fireEvent.click(createBtn);

    expect(await screen.findByPlaceholderText(/note title/i)).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/write your note here/i)).toBeInTheDocument();
  });

  test("displays saved notes when toggled", async () => {
    noteService.getNotes.mockResolvedValueOnce(mockNotes);

    renderDashboard();

    const notesBtn = await screen.findByRole("button", { name: /notes/i });
    fireEvent.click(notesBtn);

    await waitFor(() => {
      expect(screen.getByText("Note One")).toBeInTheDocument();
      expect(screen.getByText("Note Two")).toBeInTheDocument();
    });
  });

  test("selecting a saved note opens it in editor", async () => {
    noteService.getNotes.mockResolvedValueOnce(mockNotes);

    renderDashboard();

    const notesBtn = await screen.findByRole("button", { name: /notes/i });
    fireEvent.click(notesBtn);

    const noteCard = await screen.findByText("Note One");
    fireEvent.click(noteCard);

    expect(await screen.findByDisplayValue("Note One")).toBeInTheDocument();
  });
});
