export class ApiResponseDto {

  Data: any;
  Messages: string[];
  ErrorCode: Number;
  StatusCode!: Number;
  IsSuccess!:boolean;
  Identifier!:string;
}
