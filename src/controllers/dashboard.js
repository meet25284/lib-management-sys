import Book from "../models/BookSchema.js"
import Borrow from "../models/RecordSchema.js"
import User from "../models/UserSchema.js"

export const dashboard = async (req, res) =>{
    try {
        const totalBooks = await Book.aggregate([
            {
                $match:{
                    isDeleted:false
                }
            },
            {
                $count:"totalBooks"
            }
        ])

        const totalMembers = await User.aggregate([
            {
                $match:{
                    role:"member",
                    isDeleted:false
                }
            },
            {
                $count:"totalMembers"
            }
        ])

        const borrowedBooks = await Borrow.aggregate([
            {
                $match:{
                    returnDate:null,
                    isDeleted:false
                }
            },
            {
                $count:"borrowedBooks"
            }
        ])

        const overdueBooks = await Borrow.aggregate([
            {
                $group: {
                    status: "borrowed",
                    dueDate: {
                        $lt: new Date()
                    }
                }
            },
            {
                $count: "overdueBooks"
            }
        ]);


        return res.json([totalBooks,borrowedBooks,overdueBooks,totalMembers])
    } catch (error) {
        res.json({message:error.message})
        
    }
}