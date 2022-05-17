// NestJS
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Other Dependencies
import { Type } from "class-transformer";
import mongoose from 'mongoose';

// Custom
// Schemas
import { Category } from "../../categories/schemas/category.schema";
import { Review } from "../../reviews/schemas/review.schema";


export type ProductDocument = Product & mongoose.Document;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})
export class Product {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name
  })
  @Type(() => Category)
  category: Category;

  @Prop({
    type: String,
    default: null
  })
  productImage: string;

  @Prop({
    type: String,
    required: true,
    minlength: 3
  })
  brand: string;

  @Prop({
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1023,
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
    min: 0
  })
  stock: number;

  @Prop({
    type: Number,
    required: true,
    min: 0
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100
  })
  discount: number;

  @Prop({
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Review.name
    }]
  })
  @Type(() => Review)
  reviews: Review[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);