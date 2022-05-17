// Other Dependencies
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDefined, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, MinLength, ValidateNested } from "class-validator";
import { ObjectId } from 'mongoose';


class ItemsDto {
    @IsNotEmpty()
    @IsMongoId()
    id: ObjectId;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmptyObject()
    @IsObject()
    category: Object;

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    productImage: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    itemTotal: number;
}

class ShippingAddressDto {
    @IsNotEmpty()
    @IsString()
    address1: string;

    @IsString()
    address2: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    zip: string;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ItemsDto)
    items: ItemsDto[];

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress: ShippingAddressDto;

    @IsNotEmpty()
    @IsNumber()
    total: Number;
}