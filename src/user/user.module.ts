import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [JwtStrategy, UserService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1000000d' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
