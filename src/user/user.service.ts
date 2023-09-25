import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { decryptText, encryptText } from './common/crypt_text';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as process from 'process';
import { LoginUserDto } from './dto/login-user.dto';
import { I18nTranslations } from '../generated/i18n.generated';

@Injectable()
export class UserService {
  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    createUserDto.password = encryptText(createUserDto.password);

    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existUser) {
      throw new BadRequestException(
        this.i18n.t('main.email_exist_error', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const userObject = new this.userModel(createUserDto);
    const user = await userObject.save();
    const payload = { userId: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userModel.findOne({
      email: loginUserDto.email,
    });

    if (user) {
      const decryptPassword = decryptText(user.password);

      if (loginUserDto.password == decryptPassword) {
        const payload = { userId: user.id };
        return {
          accessToken: await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
          }),
        };
      }
    }

    throw new BadRequestException(
      this.i18n.t('main.invalid_credentials_error', {
        lang: I18nContext.current().lang,
      }),
    );
  }
  async getUser(userId: string): Promise<User | undefined> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.userModel
      .findOneAndUpdate({ _id: userId }, updateUserDto, {
        returnOriginal: false,
      })
      .select('-password')
      .exec();
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
