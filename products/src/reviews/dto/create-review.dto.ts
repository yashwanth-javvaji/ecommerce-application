// Other Dependencies
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ObjectId } from 'mongoose';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @IsNotEmpty()
    @IsString()
    comment: string;

    // @IsNotEmpty()
    // @IsMongoId()
    // user: ObjectId;
}
