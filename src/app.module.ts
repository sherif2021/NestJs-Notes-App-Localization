import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: AcceptLanguageResolver, options: ['accept-language'] },
      ],
      logging: false,
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        CRYPT_KEY: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
