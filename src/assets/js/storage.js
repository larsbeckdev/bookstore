const STORAGE_KEY = "books_app_books_v1";

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

export function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
