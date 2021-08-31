export default class ApiError extends Error {
  message: string = "Unknown error";

  constructor(messageOrError: Error | string) {
    super(messageOrError.toString());

    console.error("error", messageOrError);

    this.message = messageOrError.toString();
  }
}
