import "@testing-library/jest-dom";

// Polyfill for ResizeObserver (Navbar uses it)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = window.ResizeObserver || ResizeObserver;
