const formContainer = document.querySelector(".form-container");
const form = document.querySelector(".book-entry");
const title = document.querySelector(".book-title");
const author = document.querySelector(".book-author");
const pages = document.querySelector(".book-pages");
const readStatus = document.querySelector(".book-read");
const bookShelf = document.querySelector(".bookshelf");
const submitBtn = document.querySelector(".submit");
const addBookBtn = document.querySelector(".add-book");
let myLibrary = [];
let data = localStorage.getItem("MYLIB");

if (data) {
  myLibrary = JSON.parse(data);
  displayBooks();
}

submitBtn.addEventListener("click", function (e) {
  if (!title.value || !author.value || !pages.value) return;
  e.preventDefault();
  addBookToLibrary(
    new Book(title.value, author.value, pages.value, readStatus.checked)
  );
  bookShelf.innerHTML = "";
  displayBooks();
  form.reset();
  formContainer.classList.remove("open");
  localStorage.setItem("MYLIB", JSON.stringify(myLibrary));
});

addBookBtn.addEventListener("click", function () {
  formContainer.classList.toggle("open");
});

formContainer.addEventListener("click", function (e) {
  if (e.target == formContainer) {
    formContainer.classList.remove("open");
  }
});

bookShelf.addEventListener("click", function (e) {
  let element = e.target;
  const elementJob = element.dataset.job;

  if (elementJob == "checkbox") {
    completeBook(element);
  } else if (elementJob == "delete") {
    deleteBook(element);
    bookShelf.innerHTML = "";
    displayBooks();
  }
  localStorage.setItem("MYLIB", JSON.stringify(myLibrary));
  if (myLibrary.length == 0) {
    localStorage.clear();
  }
});

class Book {
  constructor(title, author, pages, read) {
    (this.title = title),
      (this.author = author),
      (this.pages = pages),
      (this.read = read);
  }
}

function addBookToLibrary(obj) {
  myLibrary.push(obj);
}

function displayBooks() {
  myLibrary.map((book, index) => {
    addBooktoShelf(book.title, book.author, book.pages, book.read, index);
  });
}

function completeBook(element) {
  const index = element.parentNode.parentNode.parentNode.parentNode.dataset.key;
  const bookInfo = element.parentNode.parentNode.parentNode.parentNode;

  bookInfo.classList.toggle("checked");
  myLibrary[index].read = element.checked;
}

function deleteBook(element) {
  const index = element.parentNode.dataset.key;
  const bookCard = element.parentNode;

  bookCard.remove();
  myLibrary.splice(index, 1);
}

function addBooktoShelf(title, author, pages, read, index) {
  const CHECKED = read ? "checked" : "";

  let bookCard = `<div class="book-card ${CHECKED}" data-key=${index}>
    <div class="hero"></div>
    <div class="book-info">
        <div class="details">
            <span class="heavy-text">Title:</span>
            <p>${title}</p>
        </div>
        <div class="details">
            <span class="heavy-text">Author:</span>
            <p>${author}</p>
        </div>
        <div class="details">
            <span class="heavy-text">Page count:</span>
            <p>${pages}</p>
        </div>
        <div class="details">
            <label class="checkbox-container">       <span class="heavy-text">Completed:</span>
            <input type="checkbox" ${CHECKED} data-job="checkbox"/>
            <span class="checkmark"></span>
            </label>
        </div>
    </div>
    <button class="delete" data-job="delete"><i class="fas fa-trash"></i></button>
  </div>`;

  bookShelf.insertAdjacentHTML("beforeend", bookCard);
}
