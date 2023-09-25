import { Controller, Get, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserGuard } from './common/user.guard';
import { UserAuth } from './common/user-auth';
import { UserJwt } from './common/user.decorato';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @Get()
  @UseGuards(UserGuard)
  getUser(@UserJwt() userAuth: UserAuth) {
    return this.userService.getUser(userAuth.userId);
  }

  @Patch()
  @UseGuards(UserGuard)
  updateUser(
    @UserJwt() userAuth: UserAuth,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userAuth.userId, updateUserDto);
  }
}
