import mongoose from "mongoose";
import productModel from "./product.model.js";
import fs from "fs";
// import { v2 as cloudinary } from "cloudinary";

let categorySchema = new mongoose.Schema(
  {
    title: {
      arabic: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 10,
      },
      english: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 10,
      },
    },
    slug: {
      arabic: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 10,
      },
      english: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 10,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imagePath : {
      type: String,
      required: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },

);

// Virtual populate for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'category'
});

const deleting = async (doc) => {
  if (doc) {
    // حذف الصورة من cloudinary
    if (doc.imagePath) {
      try {
        fs.unlinkSync(doc.imagePath);
        console.log("Deleted image:", doc.imagePath);
      }catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }
      await productModel.deleteMany({ category: doc._id }).populate("category"); // حذف المنتجات المرتبطة
    }
  };

// post hook بعد findOneAndDelete
categorySchema.post("findOneAndDelete", async function (doc) {
  await deleting(doc);
});

// post hook بعد findByIdAndDelete
categorySchema.post("findByIdAndDelete", async function (doc) {
  await deleting(doc);
});

// pre hook لـ deleteOne
categorySchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const doc = await this.model.findOne(this.getFilter());
    await deleting(doc);
  }
);

// pre hook لـ deleteMany
categorySchema.pre(
  "deleteMany",
  { document: false, query: true },
  async function () {
    const docs = await this.model.find(this.getFilter());
    for (const doc of docs) {
      await deleting(doc);
    }
  }
);

// post hook لـ remove (لو حذفت document مباشر)
categorySchema.post("remove", async function () {
  await deleting(this); // هنا this = document
});

let categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
