import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../generated/i18n.generated';

export class LoginUserDto {
  @IsEmail(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>(
        'main.email_badly_format',
      ),
    },
  )
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('main.email_required'),
  })
  email: string;

  @Length(6, 18, {
    message: i18nValidationMessage<I18nTranslations>(
      'main.password_length_error',
      {
        minLetters: 6,
        maxLetters: 16,
      },
    ),
  })
  password: string;
}
