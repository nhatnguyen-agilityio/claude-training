import { render, screen } from "@testing-library/react";
import SidebarHeader from ".";
import { AuthContext, type AuthContextType } from "@/auth/AuthContext";

const mockUser = {
  username: "testuser",
  password: "password123",
  email: "testuser@example.com",
};

const mockAuthContext: AuthContextType = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  signUp: jest.fn(),
  loading: false,
};

describe("SidebarHeader", () => {
  it("renders user info when user is present", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <SidebarHeader />
      </AuthContext.Provider>
    );
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.username.charAt(0).toUpperCase())).toBeInTheDocument();
  });

  it("renders nothing when user is null", () => {
    render(
      <AuthContext.Provider value={{ ...mockAuthContext, user: null }}>
        <SidebarHeader />
      </AuthContext.Provider>
    );
    // Should not find username or email
    expect(screen.queryByText(mockUser.username)).not.toBeInTheDocument();
    expect(screen.queryByText(mockUser.email)).not.toBeInTheDocument();
  });
});
