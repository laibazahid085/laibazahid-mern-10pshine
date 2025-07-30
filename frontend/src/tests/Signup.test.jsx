import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "../pages/Auth/Signup"; // Adjust path as needed
import * as authService from "../../services/authService";

// Mock signupUser function from authService
jest.mock("../../services/authService", () => ({
  signupUser: jest.fn(),
}));

// Mock toast to avoid actual toast rendering in tests
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe("Signup Component", () => {
  test("renders signup form with inputs and button", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    expect(screen.getByText(/signup/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });

  test("calls signupUser and shows success toast on successful signup", async () => {
    authService.signupUser.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { name: "name", value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await waitFor(() => {
      expect(authService.signupUser).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(localStorage.getItem("newlySignedUpUser")).toBe("Test User");
    expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
      "Signup successful! Please log in.",
      expect.any(Object)
    );
  });

  test("displays error message on signup failure", async () => {
    authService.signupUser.mockRejectedValueOnce({
      response: { data: { message: "Email already in use" } },
    });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { name: "name", value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    const errorMsg = await screen.findByText(/email already in use/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
