// Bücher-Likes umschalten
export function toggleLike(books, index) {
  const book = books[index];
  if (!book) return;

  book.liked = !book.liked;

  if (book.liked) book.likes++;
  else book.likes--;
}
