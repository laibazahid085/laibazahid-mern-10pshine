import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import NoteEditor from "../components/Notes/NoteEditor";

test("renders note editor UI correctly", () => {
  render(
    <MemoryRouter initialEntries={["/note/new"]}>
      <Routes>
        <Route path="/note/new" element={<NoteEditor />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
});
