// Other Dependencies
import { IsString } from "class-validator";


export class TokensDto {
  @IsString()
  accessToken: string;
  
  @IsString()
  refreshToken: string;
}