import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NoteEditor from "./NoteEditor";

test("renders note editor title", () => {
  render(
    <BrowserRouter>
      <NoteEditor />
    </BrowserRouter>
  );
  expect(screen.getByText(/create note/i)).toBeInTheDocument();
});
