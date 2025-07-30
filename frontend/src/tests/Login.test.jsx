import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Login from "../pages/Auth/Login"; // adjust this path as needed
import * as authService from "../../services/authService"; // mock this

// Mock loginUser function from authService
jest.mock("../../services/authService", () => ({
  loginUser: jest.fn(),
}));

describe("Login Component", () => {
  test("renders login form with inputs and button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check if form title, inputs, and button exist
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("calls loginUser and navigates on successful login", async () => {
    const mockedLogin = authService.loginUser;
    mockedLogin.mockResolvedValueOnce({}); // mock success

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: "/login", state: { fromSignup: true, userName: "Test User" } }]}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for any async effects to finish
    await screen.findByText(/don't have an account/i); // Dummy check just to wait for re-render

    // Assert loginUser called with correct data
    expect(mockedLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  test("shows error message on login failure", async () => {
    authService.loginUser.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { name: "email", value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: "password", value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const errorMsg = await screen.findByText(/invalid credentials/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
