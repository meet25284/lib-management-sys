import Book from "../models/BookSchema.js";

export const createBook = async (req, res) => {
    try {
        if (req.body.title && req.body.author && req.body.category && req.body.isbn && req.body.description && req.body.totalCopies && req.body.availableCopies) {
            const exist = await Book.findOne({ isbn: req.body.isbn })

            if (exist) {
                return res.status(400).json({ message: "book number already exist" })
            }
            const books = new Book({
                title: req.body.title,
                author: req.body.author,
                category: req.body.category,
                isbn: req.body.isbn,
                description: req.body.description,
                totalCopies: req.body.totalCopies,
                availableCopies: req.body.availableCopies
            })
            await Book.create(books);
            return res.status(200).json({ message: "book added successfully" });

        }
    } catch (error) {
        res.json(message.error)

    }
}

export const getallBooks = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 1;
        const books = await Book.find({ isDeleted: false }).skip((page - 1) * limit)
            .limit(limit);
        res.json(books).status(200);
    }
    catch (err) {
        res.json(message.err);
    }
}

export const getBook =async (req, res) => {
    try {
        const books = await Book.findOne({ isbn: req.params.isbn, isDeleted: false });
        if (books) {
            res.json(books).status(200);
        }
        else {
            res.status(404).json({ message: "book not found" })
        }

    }
    catch (err) {
        res.json(message.err);
    }
}

export const updateBook = async (req, res) => {
    try {

        const allowedUpdates = [
            "title",
            "category",
            "description",
            "author"
        ];

        const updates = Object.keys(req.body);

        const isValidOperation = updates.every(
            field => allowedUpdates.includes(field)
        );

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: "Invalid update fields"
            });
        }
        const bookexist = await Book.findOne({
            _id:req.params.id,
            isDeleted:false
        })

        if (!bookexist) {
            return res.status(404).json({
                message: "Book not found"
            });
        }


        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,

            {
                new: true,
                runValidators: true
            }
        );
        console.log("book:", book)

        

        res.json(book);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

export const deleteBook=  async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true
            },
            {
                new: true
            }
        );

        if (!book) {
            return res.status(404).json({
                message: "book not found"
            });
        }

        res.status(200).json({
            success: true,
            data: book,
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


export const search = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 1;

        const title = req.query.title;
        const book = await Book.find({
            title: {
                $regex:title,
                $options:"i" 
            },
            isDeleted: false
        })
        .skip((page - 1) * limit)
        .limit(limit);
        if (book.length === 0) {
            res.status(404).json({ message: "book not found" });

        }
        res.json(book);
    }
    catch (err) {
        res.json(message.err);
    }
};