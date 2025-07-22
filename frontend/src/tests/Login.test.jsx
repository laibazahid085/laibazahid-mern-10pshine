import { render, screen } from "@testing-library/react";
import Login from "../components/Auth/Login";
import { BrowserRouter } from "react-router-dom";

test("renders login form correctly", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});