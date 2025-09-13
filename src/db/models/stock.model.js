import mongoose from "mongoose";

let stockSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    
    quantity: {
        type: Number,
        required: true
    },
    color:{
        type: String
    },
    size: {
        type: String,
        required: true,
        enum: ["XS","S", "M", "L", "XL", "XXL" , "XXXL" , "4XL", "5XL" , "6XL" , "7XL" ]
    }

})

stockSchema.pre("save", async function () {
    // Only run this logic for new documents, not updates
    if (this.isNew) {
        const Stock = mongoose.model("Stock");
        const existingStock = await Stock.findOne({ 
            productId: this.productId, 
            color: this.color, 
            size: this.size 
        });
        
        if (existingStock) {
            // Update existing stock instead of creating new one
            existingStock.quantity += this.quantity;
            await existingStock.save();
            // Prevent this document from being saved
        }
    }
})

export default mongoose.model("Stock", stockSchema)