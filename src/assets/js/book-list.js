const listEl = document.getElementById("book-card-list");

function renderBooks() {
  listEl.innerHTML = "";

  for (let i = 0; i < books.length; i++) {
    listEl.innerHTML += bookCard(books[i], i);
  }
}

// Book Card Template
function bookCard(book, index) {
  return `
    <div class="book-card">

      <div class="book-card-header">
        <div class="book-card-header-heading">
          <h3>${book.name}</h3>
          <p>${book.author}</p>
        </div>

        <div class="like-container">
          <button
            onclick="toggleLike(${index})"
            class="like-btn ${book.liked ? "liked" : ""}"
          >
            <span>${book.likes}</span>
            ${heartSvg()}
          </button>
        </div>
      </div>


      <div class="book-card-main">
        <div class="book-cover-container">
          <img
            src="${
              book.cover ? book.cover : "./src/assets/images/placeholder.png"
            }"
            alt="Buchcover von ${book.name}"
            class="book-cover"
          />
        </div>

        <p>${book.price}</p>
         <p>Kommentare: ${book.publishedYear}</p>
        <p>Kommentare: ${book.comments.length}</p>


      </div>

      <div class="book-card-footer">
      <button class="add-to-cart-btn">In den Warenkorb</button>
      </div>

    </div>
  `;
}

// Like Button Heart SVG
function heartSvg() {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="heart-icon"
      aria-hidden="true"
    >
      <path
        d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
      />
    </svg>
  `;
}

// Toogle Function for Like Button
function toggleLike(index) {
  books[index].liked = !books[index].liked;

  if (books[index].liked) books[index].likes++;
  else books[index].likes--;

  renderBooks();
}

// Render Books on Page Load
renderBooks();
