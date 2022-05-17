// Common
import { OrderStatus } from "@yj-major-project/common";

// Other Dependencies
import { IsEnum, IsOptional } from "class-validator";


export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}