import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Learn from "../components/Learn";
import useUser from "../hooks/user/useUser";
import useSkills from "../hooks/skills/useSkills";
import { useAuthToken } from "../AuthTokenContext";

jest.mock("../AuthTokenContext");
jest.mock("../hooks/user/useUser");
jest.mock("../hooks/skills/useSkills");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Learn Component Tests", () => {
  const mockNavigate = jest.fn();
  const mockUser = { id: "user1", name: "Tuan" };
  const mockSkills = [
    { id: 1, title: "Skill 1", description: "Description 1", user: { id: "user2", name: "Ziyi" } },
    { id: 2, title: "Skill 2", description: "Description 2", user: { id: "user3", name: "Yue" } },
  ];
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useAuthToken.mockReturnValue({ accessToken: "fake-token" });

    global.fetch = jest.fn((url, options) => {
      if (url === `${process.env.REACT_APP_API_URL}/skills` 
      && options.method === "GET") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSkills),
        });
      }

      if (url === `${process.env.REACT_APP_API_URL}/users` 
      && options.method === "GET") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUser),
        });
      }

      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      });
    });
    useUser.mockReturnValue({ user: mockUser, errorUser: null });
    useSkills.mockReturnValue({ skills: mockSkills, errorSkills: null, loadingSkills: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Renders correctly", async () => {
    render(<Learn />);
    await waitFor(() => {
      expect(screen.getByText("Hello! Tuan")).toBeInTheDocument();
      expect(screen.getByText("Learn what you want!")).toBeInTheDocument();
      expect(screen.getByText("Skill 1")).toBeInTheDocument();
      expect(screen.getByText("Description 1")).toBeInTheDocument();
      expect(screen.getByText("Posted by: Ziyi")).toBeInTheDocument();
      expect(screen.getByText("Skill 2")).toBeInTheDocument();
      expect(screen.getByText("Description 2")).toBeInTheDocument();
      expect(screen.getByText("Posted by: Yue")).toBeInTheDocument();
    });
  });

  test("Clicking on learn more button", async () => {
    render(<Learn />);
    await waitFor(() => {
      expect(screen.getByText("Skill 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Learn more")[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/app/skill/1");

    fireEvent.click(screen.getAllByText("Learn more")[1]);
    expect(mockNavigate).toHaveBeenCalledWith("/app/skill/2");
    });

    test("displays error message when fetch fails", async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        })
      );

      useSkills.mockReturnValue({ skills: [], errorSkills: "Failed to fetch skills", loadingSkills: false });
  
      render(<Learn />);
  
      await waitFor(() => {
        expect(screen.getByText("Error: Failed to fetch skills")).toBeInTheDocument();
      });
    });
});