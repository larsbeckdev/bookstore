const listEl = document.getElementById("book-card-list");

// Bücher rendern
function renderBooks() {
  listEl.innerHTML = "";

  for (let i = 0; i < books.length; i++) {
    listEl.innerHTML += bookCard(books[i], i);
  }
}

// Kommentare rendern
function renderComments(book, container) {
  container.innerHTML = "";

  book.comments.forEach((c) => {
    const li = document.createElement("li");
    li.className = "book-comment";

    li.innerHTML = `
      <div class="book-comment-header">
        <strong class="book-comment-name">${escapeHtml(c.name)}</strong>
        <span class="book-comment-time">${formatTime(c.createdAt)}</span>
      </div>
      <p class="book-comment-text">${escapeHtml(c.comment)}</p>
    `;

    container.appendChild(li);
  });
}

// Kommentar absenden
function setupCommentForm(book, cardEl) {
  const nameInput = cardEl.querySelector(".book-comment-name-input");
  const textInput = cardEl.querySelector(".book-comment-text-input");
  const submitBtn = cardEl.querySelector(".book-comment-submit");
  const listEl = cardEl.querySelector(".book-comments-list");

  submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) return;

    book.comments.push({
      name,
      comment: text,
      createdAt: new Date().toISOString(),
    });

    nameInput.value = "";
    textInput.value = "";

    renderComments(book, listEl);
  });

  renderComments(book, listEl);
}

// Book Card Template
function bookCard(book, index) {
  return /* html */ `
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
        <div class="book-cover-main-container">
          <div class="book-cover-container">
          <img
            src="${
              book.cover ? book.cover : "./src/assets/images/placeholder.png"
            }"
            alt="Buchcover von ${book.name}"
            class="book-cover"
          />
        </div>
        <div class="book-copyright-container">
        <p class="book-copyright">Copyright © ${new Date().getFullYear()} ${
    book.author
  }</p>
        </div>

        

        </div>
        

        <div class="book-price-container"><p class="book-price"> ${new Intl.NumberFormat(
          "de-DE",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(book.price)}</p> <span class="currency">${book.currency}</span>
        </div>

        <div class="book-details">
          <p class="book-genre">Kategorie: ${book.genre}</p>
          <p class="book-published-year">Veröffentlicht: ${
            book.publishedYear
          }</p>
        </div>

      <div class="book-card-footer">
      

      <div class="book-card-footer-inner">
      <button class="add-to-cart-btn">In den Warenkorb</button>

      <div class="book-comments-section">
        <h4>Kommentare:</h4>
        <li class="book-comment">
  <div class="book-comment-header">
    <strong class="book-comment-name">Name</strong>
    <span class="book-comment-time">vor 3 Min.</span>
  </div>
  <p class="book-comment-text">Kommentartext</p>
</li>

        <div>
          <input class="book-comment-name-input" placeholder="Name...">
          <textarea class="book-comment-text-input" placeholder="Kommentar..."></textarea>
          <button class="book-comment-submit">Absenden</button>
        </div>

      </div>

    </div>
  `;
}

// Like Button Heart SVG
function heartSvg() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
    class="lucide lucide-heart-icon lucide-heart heart-icon">
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
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

// Zeit formatieren
function formatTime(dateString) {
  const date = new Date(dateString);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60) return "gerade eben";
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;

  return date.toLocaleDateString("de-DE");
}

// Render Books on Page Load
renderBooks();
