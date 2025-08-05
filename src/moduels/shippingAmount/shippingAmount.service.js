import ShippingAmount from "../../db/models/shippingAmount.js";

// Get all shipping amounts
export const getShippingAmounts = async (req, res) => {
    try {
        const shippingAmounts = await ShippingAmount.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Shipping amounts retrieved successfully",
            shippingAmounts
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving shipping amounts",
            error: error.message
        });
    }
};
export const getShippingAmountsUser = async (req, res) => {
    try {
        const shippingAmounts = await ShippingAmount.find({ active: true }).sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Shipping amounts retrieved successfully",
            shippingAmounts
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving shipping amounts",
            error: error.message
        });
    }
};

// Get shipping amount by ID
export const getShippingAmount = async (req, res) => {
    try {
        const { id } = req.params;
        
        const shippingAmount = await ShippingAmount.findById(id);
        
        if (!shippingAmount) {
            return res.status(404).json({
                message: "Shipping amount not found"
            });
        }
        
        res.status(200).json({
            message: "Shipping amount retrieved successfully",
            shippingAmount
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving shipping amount",
            error: error.message
        });
    }
};

// Create new shipping amount
export const createShippingAmount = async (req, res) => {
    try {
        const { amount, city, active = true } = req.body;
        
        // Check if shipping amount for this city already exists
        const existingShippingAmount = await ShippingAmount.findOne({ city });
        
        if (existingShippingAmount) {
            return res.status(400).json({
                message: "Shipping amount for this city already exists"
            });
        }
        
        const newShippingAmount = new ShippingAmount({
            amount,
            city,
            active
        });
        
        const savedShippingAmount = await newShippingAmount.save();
        
        res.status(201).json({
            message: "Shipping amount created successfully",
            shippingAmount: savedShippingAmount
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating shipping amount",
            error: error.message
        });
    }
};

// Update shipping amount
export const updateShippingAmount = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, city, active } = req.body;
        
        const shippingAmount = await ShippingAmount.findById(id);
        
        if (!shippingAmount) {
            return res.status(404).json({
                message: "Shipping amount not found"
            });
        }
        
        // If city is being updated, check if it already exists for another record
        if (city && city !== shippingAmount.city) {
            const existingShippingAmount = await ShippingAmount.findOne({ 
                city, 
                _id: { $ne: id } 
            });
            
            if (existingShippingAmount) {
                return res.status(400).json({
                    message: "Shipping amount for this city already exists"
                });
            }
        }
        
        // Update fields
        if (amount !== undefined) shippingAmount.amount = amount;
        if (city !== undefined) shippingAmount.city = city;
        if (active !== undefined) shippingAmount.active = active;
        
        const updatedShippingAmount = await shippingAmount.save();
        
        res.status(200).json({
            message: "Shipping amount updated successfully",
            shippingAmount: updatedShippingAmount
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating shipping amount",
            error: error.message
        });
    }
};

// Delete shipping amount
export const deleteShippingAmount = async (req, res) => {
    try {
        const { id } = req.params;
        
        const shippingAmount = await ShippingAmount.findById(id);
        
        if (!shippingAmount) {
            return res.status(404).json({
                message: "Shipping amount not found"
            });
        }
        
        await ShippingAmount.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Shipping amount deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting shipping amount",
            error: error.message
        });
    }
};

// Get shipping amount by city
export const getShippingAmountByCity = async (req, res) => {
    try {
        const { city } = req.params;
        
        const shippingAmount = await ShippingAmount.findOne({ 
            city, 
            active: true 
        });
        
        if (!shippingAmount) {
            return res.status(404).json({
                message: "Shipping amount not found for this city"
            });
        }
        
        res.status(200).json({
            message: "Shipping amount retrieved successfully",
            shippingAmount
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving shipping amount",
            error: error.message
        });
    }
}; 