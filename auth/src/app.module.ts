// Nest
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

// YJ
import { JwtAccessTokenAuthGuard } from '@yj-major-project/common';

// Custom
// Entities
import { User } from './users/entities/user.entity';
// Modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: process.env.MONGO_URI,
      useUnifiedTopology: true,
      entities: [User]
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        stopAtFirstError: true
      })
    },
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenAuthGuard
    }
  ]
})
export class AppModule {}
