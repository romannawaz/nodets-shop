import { IsDefined, IsEmail, IsString, MinLength } from "class-validator";

export class UserSignInDto {
  @IsDefined({ message: "email should be provided" })
  @IsEmail()
  public email!: string;

  @IsDefined({ message: "password should be provided" })
  @IsString()
  public password!: string;
}

export class UserSignUpDto {
  @IsDefined({ message: "email should be provided" })
  @IsEmail()
  public email!: string;

  @IsDefined({ message: "email should be provided" })
  @IsString()
  @MinLength(5, {
    message: "name is too short",
  })
  public name!: string;

  @IsDefined({ message: "password should be provided" })
  @IsString()
  public password!: string;
}
