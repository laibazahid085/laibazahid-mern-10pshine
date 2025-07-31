import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Profile from "../pages/Profile"; // Adjust path if needed
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Mock axios
jest.mock("axios");

// Mock localStorage
beforeEach(() => {
  localStorage.setItem("token", "dummy_token");
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("Profile Component", () => {
  test("renders loading initially", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  test("fetches and displays user data on mount", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(await screen.findByText(/👤 user profile/i)).toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  test("shows alert and redirects on fetch failure", async () => {
    window.alert = jest.fn();
    delete window.location;
    window.location = { href: "" };

    axios.get.mockRejectedValueOnce(new Error("Unauthorized"));

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Could not load profile. Please login again."
      );
      expect(window.location.href).toBe("/login");
    });
  });

  test("logout removes token and redirects", () => {
    delete window.location;
    window.location = { href: "" };

    axios.get.mockResolvedValueOnce({
      data: {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
//work
    waitFor(async () => {
      await screen.findByText(/test user/i);
      const logoutBtn = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(logoutBtn);

      expect(localStorage.getItem("token")).toBe(null);
      expect(window.location.href).toBe("/login");
    });
  });
});
