import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";

describe("Navbar Component", () => {
  test("renders navbar with buttons", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/MERN Notes App/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });

  test("logout button removes token and redirects", () => {
    localStorage.setItem("token", "test-token");

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(localStorage.getItem("token")).toBeNull();
  });
});
