// Other Dependencies
import { IsMongoId, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { ObjectId } from 'mongoose';


export class CreateReviewDto {
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(20)
    comment: string;

    @IsNotEmpty()
    @IsMongoId()
    user: ObjectId;
}