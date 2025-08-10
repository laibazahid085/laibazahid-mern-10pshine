import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Helper to test route
const renderWithRoute = (route) => {
  window.history.pushState({}, "Test page", route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
};

describe("App Routing", () => {
  it("renders Login component on / route", () => {
    renderWithRoute("/");
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("renders Signup component on /signup", () => {
    renderWithRoute("/signup");
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("renders 404 Not Found on unknown route", () => {
    renderWithRoute("/something-random");
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
