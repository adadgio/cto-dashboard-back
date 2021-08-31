export default class ApiError extends Error {
  errorMessage: string = "Unknown error";

  constructor(message: any) {
    super(message.toString());
    this.name = "ApiError";
  }
}
