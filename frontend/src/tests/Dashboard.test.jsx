import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

jest.mock("../Notes/NoteList", () => () => (
  <div data-testid="note-list">Mock NoteList</div>
));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Dashboard Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders the dashboard title", () => {
    renderWithRouter(<Dashboard />);
    const title = screen.getByText(/Welcome to Dashboard 🚀/i);
    expect(title).toBeInTheDocument();
  });

  test("renders the logout button", () => {
    renderWithRouter(<Dashboard />);
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test("logout button clears token and navigates to home", () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    const DashboardWithMockNavigate = require("./Dashboard").default;

    renderWithRouter(<DashboardWithMockNavigate />);
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(localStorage.getItem("token")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("renders NoteList component", () => {
    renderWithRouter(<Dashboard />);
    const noteList = screen.getByTestId("note-list");
    expect(noteList).toBeInTheDocument();
  });
});
