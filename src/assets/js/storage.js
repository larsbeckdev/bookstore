const STORAGE_KEY = "books";

// Bücher aus dem Local Storage laden
export function loadBooks(fallbackBooks = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallbackBooks;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallbackBooks;
  } catch {
    return fallbackBooks;
  }
}

// Bücher im Local Storage speichern
export function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
