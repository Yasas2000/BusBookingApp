const Booking = require("../model/booking")

exports.bookSeat = async(req,res)=>{
    const userId = req.user.userId
    console.log(req.body);
    const {bus_id, payment_id} = req.body;
    const booking = new Booking({user_id:userId,bus_id,payment_id});
    await booking.save();
    res.json({message:"Bokking was confirmed"});
}