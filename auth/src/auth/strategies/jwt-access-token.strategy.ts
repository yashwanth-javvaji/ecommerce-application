// Nest
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

// YJ
import { PayloadDto } from "@yj-major-project/common";

// Other Dependencies
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY
    })
  }

  async validate(payload: PayloadDto) {
    return payload
  }
}