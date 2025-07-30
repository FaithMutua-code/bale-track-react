import Bale from "../models/baleModel.js";



const createBale = async(req, res) => {
    

    //Extract data from the req.body
    const { baleType, transactionType, quantity, pricePerUnit,notes} = req.body;

    //access authenticated user from middleware
    const userId = req.user.id;

    //basic validation 
    if( !baleType || !transactionType || !quantity || !pricePerUnit){
        console.error(error)
        return res.status(400).json({
            error:"All fields are required",
            success:false
            
        })
    }

    

}