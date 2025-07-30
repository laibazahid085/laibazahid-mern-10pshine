import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteEditor from "../components/NoteEditor"; // Adjust path
import * as toastify from "react-toastify";
import * as confirm from "react-confirm-alert";
import ReactQuill from "react-quill";

// Mock ReactQuill to behave like a simple textarea
jest.mock("react-quill", () => {
  return ({ value, onChange }) => (
    <textarea
      data-testid="quill-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
});

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock confirmAlert
jest.mock("react-confirm-alert", () => ({
  confirmAlert: jest.fn(),
}));

describe("NoteEditor Component", () => {
  const mockOnSave = jest.fn(() => Promise.resolve());
  const mockOnDelete = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders inputs and buttons", () => {
    render(<NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} />);
    
    expect(screen.getByPlaceholderText(/note title/i)).toBeInTheDocument();
    expect(screen.getByTestId("quill-editor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  test("calls onSave with correct data", async () => {
    render(<NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} />);

    fireEvent.change(screen.getByPlaceholderText(/note title/i), {
      target: { value: "Test Title" },
    });

    fireEvent.change(screen.getByTestId("quill-editor"), {
      target: { value: "Test Content" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: "Test Title",
        content: "Test Content",
      });
    });

    expect(toastify.toast.success).toHaveBeenCalledWith("Note created!");
  });

  test("shows error if title or content is empty", () => {
    render(<NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(toastify.toast.error).toHaveBeenCalledWith("Title and content are required!");
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("shows delete button if selectedNote is provided", () => {
    render(
      <NoteEditor
        selectedNote={{ _id: "1", title: "Test", content: "Test content" }}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  test("calls confirmAlert on delete", () => {
    render(
      <NoteEditor
        selectedNote={{ _id: "1", title: "Test", content: "Test content" }}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(confirm.confirmAlert).toHaveBeenCalled();
  });
});
