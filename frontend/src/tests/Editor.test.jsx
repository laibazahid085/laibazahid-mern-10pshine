import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NoteEditor from "../components/Notes/NoteEditor";
import * as noteService from "../services/noteService";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useParams: () => ({ id: null }),
}));

jest.mock("react-quill", () => (props) => {
  return (
    <textarea
      data-testid="quill-editor"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
});

describe("NoteEditor - Create Mode", () => {
  test("renders create note UI", () => {
    render(
      <MemoryRouter>
        <NoteEditor />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByTestId("quill-editor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("shows error if title or content is empty", async () => {
    render(
      <MemoryRouter>
        <NoteEditor />
      </MemoryRouter>
    );

    const saveBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveBtn);

    expect(await screen.findByText(/both fields are required/i)).toBeInTheDocument();
  });

  test("calls createNote and navigates after save", async () => {
    const createNoteMock = jest
      .spyOn(noteService, "createNote")
      .mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <NoteEditor />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "My Note Title" },
    });
    fireEvent.change(screen.getByTestId("quill-editor"), {
      target: { value: "My note content" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(createNoteMock).toHaveBeenCalledWith({
        title: "My Note Title",
        content: "My note content",
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("navigates to dashboard on cancel", () => {
    render(
      <MemoryRouter>
        <NoteEditor />
      </MemoryRouter>
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
