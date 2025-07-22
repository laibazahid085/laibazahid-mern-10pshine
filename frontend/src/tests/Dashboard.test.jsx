import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

test("renders dashboard title and logout button", () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

  expect(screen.getByText(/welcome to dashboard/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
});
