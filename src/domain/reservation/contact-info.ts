import { IsEmail, IsNumberString, MinLength } from 'class-validator';

class ContactInfo {
  @IsEmail({})
  email: string;

  @IsNumberString({ no_symbols: true })
  @MinLength(11)
  tel: string;

  constructor(tel: string, email: string) {
    this.email = email;
    this.tel = tel;
  }
}

export { ContactInfo };
