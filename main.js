//Local storage start
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APPS";

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

//Local storage end

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const addBook = () => {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const timestamp = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    timestamp,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveStorage();
};

const generateId = () => {
  return +new Date();
};

const generateBookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

const books = [];
const RENDER_EVENT = "render-bookshelf";

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const item of books) {
    const element = makeList(item);
    if (!item.isCompleted) {
      incompleteBookshelfList.append(element);
    } else {
      completeBookshelfList.append(element);
    }
  }
});

const makeList = (book) => {
  const textBookTitle = document.createElement("h3");
  textBookTitle.innerText = book.title;

  const textBookAuthor = document.createElement("p");
  textBookAuthor.innerText = "Penulis: " + book.author;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = "Tahun: " + book.year;

  const formButton = document.createElement("div");
  formButton.classList.add("action");

  if (book.isCompleted) {
    const doneButton = document.createElement("button");
    doneButton.innerText = "Belum Selesai dibaca";
    doneButton.classList.add("green");

    doneButton.addEventListener("click", function () {
      addTaskToIncomplete(book.id);
    });

    const delButton = document.createElement("button");
    delButton.innerText = "Hapus buku";
    delButton.classList.add("red");

    delButton.addEventListener("click", function () {
      removeTask(book.id);
    });
    formButton.append(doneButton, delButton);
  } else {
    const undoneButton = document.createElement("button");
    undoneButton.innerText = "Selesai dibaca";
    undoneButton.classList.add("green");

    undoneButton.addEventListener("click", function () {
      addTaskToCompleted(book.id);
    });

    const delButton = document.createElement("button");
    delButton.innerText = "Hapus buku";
    delButton.classList.add("red");

    delButton.addEventListener("click", function () {
      removeTask(book.id);
    });
    formButton.append(undoneButton, delButton);
  }

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(textBookTitle, textBookAuthor, textTimestamp, formButton);

  article.setAttribute("id", `book-${book.id}`);

  return article;
};

const addTaskToCompleted = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveStorage();
};

const addTaskToIncomplete = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveStorage();
};

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
};

const removeTask = (bookId) => {
  const bookTarget = findTodoIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveStorage();
};

const findTodoIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

const saveStorage = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};
