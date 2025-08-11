import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteEditor from "../components/Notes/NoteEditor";
import * as toastify from "react-toastify";
import * as confirm from "react-confirm-alert";

// Mock ReactQuill as a textarea
vi.mock("react-quill", () => ({
  default: ({ value, onChange }) => (
    <textarea
      data-testid="quill-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock confirmAlert
vi.mock("react-confirm-alert", () => ({
  confirmAlert: vi.fn(),
}));

describe("NoteEditor Component", () => {
  const mockOnSave = vi.fn(() => Promise.resolve());
  const mockOnDelete = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    vi.clearAllMocks();
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
