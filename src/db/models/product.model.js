import mongoose from "mongoose";
import stockModel from "./stock.model.js";




let productSchema = new mongoose.Schema({
    title: {
        arabic: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            min: 3,
            max: 10
        },
        english: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            min: 3,
            max: 10
        }
    },
    slug: {
        arabic: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            
        },
        english: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
           
        }
    },
    image: {
        type: String
    },
    images: {
        type: [String],
        required: true
    },
    description: {
        arabic: {
            type: String,
            required: true
        },
        english: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    finalPrice: {
        type: Number,
        default: function() {
            return this.price || 0;
        },
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: false
    },
    isDiscounted: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},
    {
        timestamps: true,
        versionKey: false
    })

// Middleware لحساب السعر النهائي قبل الحفظ
productSchema.pre('save', function(next) {
    // تحديث isDiscounted بناءً على قيمة discount
    this.isDiscounted = this.discount > 0;
    
    // حساب السعر النهائي
    if (this.isDiscounted) {
        this.finalPrice = this.price - (this.price * (this.discount / 100));
    } else {
        this.finalPrice = this.price;
    }
    next();
});

// Middleware لحساب السعر النهائي قبل التحديث
productSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    
    // تحديث isDiscounted بناءً على قيمة discount
    if (update.discount !== undefined) {
        update.isDiscounted = update.discount > 0;
    }
    
    // حساب السعر النهائي
    if (update.isDiscounted && update.discount > 0) {
        update.finalPrice = update.price - (update.price * (update.discount / 100));
    } else if (update.price !== undefined) {
        update.finalPrice = update.price;
    }
    next();
});


const deleting = async (doc) => {
    if (doc) {
        console.log("Deleting product", doc._id);

        await stockModel.deleteMany({ productId: doc._id });
        console.log("Deleted product stocks:", doc._id);

        




    }
};

// post hook بعد findOneAndDelete
productSchema.post("findOneAndDelete", async function (doc) {
    await deleting(doc);
});

// post hook بعد findByIdAndDelete
productSchema.post("findByIdAndDelete", async function (doc) {
    await deleting(doc);
});

// pre hook لـ deleteOne
productSchema.pre("deleteOne", { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter());
    await deleting(doc);
});

// pre hook لـ deleteMany
productSchema.pre("deleteMany", { document: false, query: true }, async function () {
    const docs = await this.model.find(this.getFilter());
    for (const doc of docs) {
        await deleting(doc);
    }
});

// post hook لـ remove (لو حذفت document مباشر)
productSchema.post("remove", async function () {
    await deleting(this); // هنا this = document
});





let productModel = mongoose.model("Product", productSchema);



export default productModel