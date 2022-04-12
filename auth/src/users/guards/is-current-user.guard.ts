// NestJS
import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';

// Custom
// Services
import { UsersService } from '../users.service';


@Injectable()
export class IsCurrentUser implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user = await this.usersService.findById(request.user.id);
    return user._id == params.id;
  }
}