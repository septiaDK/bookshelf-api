const { nanoid } = require('nanoid');
const books = require('./books');

// function add book
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// varibel container book filter name
const bookFilters = ({
  id,
  name,
  year,
  author,
  summary,
  publisher,
  pageCount,
  readPage,
  finished,
  reading,
  insertedAt,
  updatedAt,
}) => ({
  id,
  name,
  year,
  author,
  summary,
  publisher,
  pageCount,
  readPage,
  finished,
  reading,
  insertedAt,
  updatedAt,
});

// function get all book
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let bookFilter;

  // condition filter by name
  if (name !== undefined) {
    // function map bookFilters add variabel bookFilters
    bookFilter = books.map(bookFilters).filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: bookFilter,
      },
    });
    response.code(200);
    return response;
  }

  // condition filter by reading
  if (reading !== undefined) {
    if (reading === '1') {
      bookFilter = books.filter((book) => book.reading === true);
    } else if (reading === '0') {
      bookFilter = books.filter((book) => book.reading === false);
    }

    const response = h.response({
      status: 'success',
      data: {
        books: bookFilter,
      },
    });
    response.code(200);
    return response;
  }

  // condition filter by finished
  if (finished !== undefined) {
    if (finished === '1') {
      bookFilter = books.filter((book) => book.finished === true);
    } else if (finished === '0') {
      bookFilter = books.filter((book) => book.finished === false);
    }

    const response = h.response({
      status: 'success',
      data: {
        books: bookFilter,
      },
    });
    response.code(200);
    return response;
  }

  // condition get all book
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

// function get detail book by id
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// function edit book by id
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// delete book by id
const deleteBooksIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBooksIdHandler,
};
