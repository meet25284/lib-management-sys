import Book from "../models/BookSchema.js";

export const createBook = async (req, res) => {
    try {
        if (req.body.title && req.body.author && req.body.category && req.body.isbn && req.body.description && req.body.totalCopies) {
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
            })
            await Book.create(books);
            return res.status(200).json({ message: "book added successfully" });

        }
    } catch (error) {
        res.json({message:error.message})

    }
}

export const getallBooks = async (req, res) => {
    try {
        // const page = req.query.page || 1;
        // const limit = req.query.limit || 10;
        const books = await Book.find({ isDeleted: false })
        // .skip((page - 1) * limit)
        //     .limit(limit);
        res.json(books).status(200);
    }
    catch (err) {
        res.json(message.err);
    }
}

export const getBook = async (req, res) => {
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
      console.log(req.params.id)
      console.log(req.body)
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
            isbn: req.params.id,
            isDeleted: false
        })

        if (!bookexist) {
            return res.status(404).json({
                message: "Book not found"
            });
        }


        const book = await Book.findOneAndUpdate(
            {isbn:req.params.id},
            req.body,

            {
                new: true,
                runValidators: true
            }
        );



        res.json({message:"book updated successfull"});

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate(
            {isbn:req.params.id},
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
            message:"book deleted successfull"
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
                $regex: title,
                $options: "i"
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