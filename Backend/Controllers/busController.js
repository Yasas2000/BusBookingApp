const Bus =  require("../model/bus")

exports.insertBus = async (req,res)=>{
    try{const{bus_id,bus_name,bus_type,capacity,operator_id} = req.body;
    const bus = new Bus({bus_id,bus_name,bus_type,capacity,operator_id})
    await bus.save();
    res.json({message:"Bus has been entered",bus}) }
    catch(error){
    res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}