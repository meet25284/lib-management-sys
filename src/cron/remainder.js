import cron from "node-cron";
import Borrow from "../models/RecordSchema.js";

function getDayRange(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

export function startDailyReminders() {
    try{
        cron.schedule("*/59 * * * *", async () => {  
      const today = getDayRange(new Date());
      const tomorrowDate = new Date(today.start);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = getDayRange(tomorrowDate);
  
      const dueTomorrow = await Borrow.find({
        isDeleted: false,
        returnDate: null,
        status: "borrowed",
        dueDate: { $gte: tomorrow.start, $lt: tomorrow.end },
      }).populate("userId");
  
      const overdue = await Borrow.find({
        isDeleted: false,
        returnDate: null,
        status: "overdue",
      }).populate("userId");
  
      if (dueTomorrow.length > 0) {
        console.log("Due tomorrow:", dueTomorrow);
      }
  
      if (overdue.length > 0) {
        console.log("Overdue:", overdue);
      }
    });
  }catch(err){
    console.log(err)
  }}

export const updateStatus=()=>{
    cron.schedule("*/59 * * * *" , async ()=>{
        await Borrow.updateMany(    
            {
              isDeleted: false,
              returnDate: null,
              dueDate: { $lt: new Date() },
              status: "borrowed",
            },
            { $set: { status: "overdue" } },
            {
                new:true

            }
          );
      
         
    })
}