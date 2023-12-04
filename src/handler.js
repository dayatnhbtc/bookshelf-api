const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const id = nanoid(16);
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = readPage >= pageCount;

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

    if (!name) {
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
            message:
                'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

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
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooks = (request, h) => {
    const booksTitles = books.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
    }));

    const requestedName = request.query.name;
    const requestReading = request.query.reading;
    const requestFinished = request.query.finished;

    switch (true) {
        case (requestedName !== undefined): {
            const requestedNameLowerCase = requestedName.toLowerCase();
            const bookTitlesByRequest = books
                .filter((book) =>
                    book.name.toLowerCase().includes(requestedNameLowerCase)
                )
                .map(({ id, name, publisher }) => ({
                    id,
                    name,
                    publisher,
                }));

            const response = h.response({
                status: 'success',
                data: {
                    books: bookTitlesByRequest,
                },
            });
            response.code(200);
            return response;
        }
        case (requestReading === '0'): {
            const bookTitlesByRequest = books
                .filter((book) => book.reading === false)
                .map(({ id, name, publisher }) => ({
                    id,
                    name,
                    publisher,
                }));

            const response = h.response({
                status: 'success',
                data: {
                    books: bookTitlesByRequest,
                },
            });
            response.code(200);
            return response;
        }
        case (requestReading === '1'): {
            const bookTitlesByRequest = books
                .filter((book) => book.reading === true)
                .map(({ id, name, publisher }) => ({
                    id,
                    name,
                    publisher,
                }));

            const response = h.response({
                status: 'success',
                data: {
                    books: bookTitlesByRequest,
                },
            });
            response.code(200);
            return response;
        }
        case (requestFinished === '0'): {
            const bookTitlesByRequest = books
                .filter((book) => book.finished === false)
                .map(({ id, name, publisher }) => ({
                    id,
                    name,
                    publisher,
                }));

            const response = h.response({
                status: 'success',
                data: {
                    books: bookTitlesByRequest,
                },
            });
            response.code(200);
            return response;
        }
        case (requestFinished === '1'): {
            const bookTitlesByRequest = books
                .filter((book) => book.finished === true)
                .map(({ id, name, publisher }) => ({
                    id,
                    name,
                    publisher,
                }));

            const response = h.response({
                status: 'success',
                data: {
                    books: bookTitlesByRequest,
                },
            });
            response.code(200);
            return response;
        }
        default: {
            const response = h.response({
                status: 'success',
                data: {
                    books: booksTitles,
                },
            });

            response.code(200);
            return response;
        }
    }
};


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

const updateBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const finished = readPage >= pageCount;

    if (!name) {
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
            message:
                'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        const { insertedAt } = books[index];
        books[index] = {
            ...books[index],
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

const deleteBookByIdHandler = (request, h) => {
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
    getAllBooks,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler,
};
