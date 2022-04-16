// NestJS
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Other Dependencies
import { Document } from 'mongoose';


export type CategoryDocument = Category & Document;

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
export class Category {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 3
  })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);