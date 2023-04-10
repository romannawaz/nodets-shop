import { IsDefined, IsString, MinLength } from "class-validator";

export class CreateProductDto {
  @IsDefined({ message: "title should be provided" })
  @MinLength(5)
  @IsString()
  public title!: string;
}
