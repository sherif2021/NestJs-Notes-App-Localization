import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import {
  I18nContext,
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { I18nTranslations } from './generated/i18n.generated';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter(data: ValidationError[]) {
        const customErrors: string[] = [];
        data.forEach((error) => {
          for (const type in error.constraints) {
            if (type == 'whitelistValidation') {
              const i18n: I18nContext<I18nTranslations> = I18nContext.current();
              const message = i18n
                .t('main.whitelist_validation_error', {
                  lang: i18n.lang,
                  args: { name: error.property },
                })
                .toString();
              customErrors.push(message);
            } else {
              const errorMessage = error.constraints[type].trim();
              if (errorMessage.length > 0) {
                customErrors.push(errorMessage);
              }
            }
          }
        });
        return customErrors;
      },
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
