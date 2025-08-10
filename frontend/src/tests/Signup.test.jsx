import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "../pages/Auth/Signup";

// ✅ Mock react-toastify
vi.mock("react-toastify", async () => {
  const actual = await vi.importActual("react-toastify");
  return {
    ...actual,
    toast: {
      success: vi.fn(),
    },
  };
});

// ✅ Mock authService (ESM-friendly)
vi.mock("../../services/authService", async () => {
  return {
    signupUser: vi.fn(),
  };
});

// ✅ Import the mocked module after mocking it
import * as authService from "../../services/authService";

describe("Signup Component", () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  };

  test("renders signup form inputs and button", () => {
    setup();

    expect(screen.getByText(/signup/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /signup/i })
    ).toBeInTheDocument();
  });

  test("displays error for weak password", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Weak Tester" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "weak@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123" }, // Weak password
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    const errorMsg = await screen.findByText(
      /password must be at least 8 characters/i
    );
    expect(errorMsg).toBeInTheDocument();
    expect(authService.signupUser).not.toHaveBeenCalled();
  });

  test("calls signupUser and shows toast on successful signup", async () => {
    authService.signupUser.mockResolvedValueOnce({});

    setup();

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "StrongPass1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await waitFor(() => {
      expect(authService.signupUser).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "StrongPass1!",
      });
    });

    expect(localStorage.getItem("newlySignedUpUser")).toBe("Test User");

    expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
      "Signup successful! Please log in.",
      expect.any(Object)
    );
  });

  test("displays error message on API failure", async () => {
    authService.signupUser.mockRejectedValueOnce({
      response: { data: { message: "Email already in use" } },
    });

    setup();

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "StrongPass1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    const errorMsg = await screen.findByText(/email already in use/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
