import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeroSection from "../pages/HeroSection";

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  global.IntersectionObserver = IntersectionObserverMock;
});

describe("HeroSection Component", () => {
  test('renders main title "Sweets"', () => {
    render(<HeroSection />);
    // Select only the main heading by role and text
    const mainHeading = screen.getByRole("heading", {
      name: /Sweets/i,
      level: 2, // match h2
    });
    expect(mainHeading).toBeInTheDocument();
  });

  test("renders product counts for categories", () => {
    render(<HeroSection />);
    expect(screen.getByText(/97\s+Products/i)).toBeInTheDocument();
    expect(screen.getByText(/45\s+Products/i)).toBeInTheDocument();
    expect(screen.getByText(/6\s+Products/i)).toBeInTheDocument();
    expect(screen.getByText(/17\s+Products/i)).toBeInTheDocument();
    expect(screen.getByText(/22\s+Products/i)).toBeInTheDocument();
    expect(screen.getByText(/32\s+Products/i)).toBeInTheDocument();
  });

  test("renders feature texts", () => {
    render(<HeroSection />);
    expect(screen.getByText(/National Shipping in 5–7 days/i)).toBeInTheDocument();
    expect(screen.getByText(/15 Days Shelf Life/i)).toBeInTheDocument();
    expect(screen.getByText(/Global Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/No Preservatives/i)).toBeInTheDocument();
  });

  test("renders category titles", () => {
    render(<HeroSection />);
    // Get all category cards
    const cards = screen.getAllByRole("heading", { level: 6 });

    // Check the text within each h6
    const cardTexts = cards.map(card => card.textContent);
    expect(cardTexts).toContain("All Products");
    expect(cardTexts).toContain("Sweets");
    expect(cardTexts).toContain("Indian Biscotti");
    expect(cardTexts).toContain("Sugar Free");
    expect(cardTexts).toContain("Tea Time Snacks");
    expect(cardTexts).toContain("Cake");
  });
});
