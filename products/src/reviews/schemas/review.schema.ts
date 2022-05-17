// NestJS
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Other Dependencies
import { Type } from "class-transformer";
import mongoose from "mongoose";

// Custom
// Schemas
import { User } from "../../users/schemas/user.schema";


export type ReviewDocument = Review & mongoose.Document;

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
export class Review {
  @Prop({
    type: Number,
    min: 0,
    max: 5,
    default: 0
  })
  rating: number;

  @Prop({
    type: String,
    required: true,
    minlength: 20
  })
  comment: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  @Type(() => User)
  user: User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);