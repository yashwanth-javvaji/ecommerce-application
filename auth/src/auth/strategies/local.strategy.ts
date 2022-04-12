// NestJS
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

/// Other Dependencies
import { Strategy } from "passport-local";

// Custom
// Services
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string) {
    return await this.authService.validateUser({ email, password });
  }
} 