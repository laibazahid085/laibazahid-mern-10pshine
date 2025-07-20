import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

test("renders dashboard title", () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
  expect(screen.getByText(/welcome to dashboard/i)).toBeInTheDocument();
});
