import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

test("calls onSearch when input changes", () => {
  const handleSearch = jest.fn();
  render(<Navbar onSearch={handleSearch} />);
  const input = screen.getByPlaceholderText(/search notes/i);
  fireEvent.change(input, { target: { value: "hello" } });
  expect(handleSearch).toHaveBeenCalledWith("hello");
});