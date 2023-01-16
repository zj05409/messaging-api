class UserGetResponse {
  constructor(readonly userId: string, readonly username: string, readonly email: string, readonly avatar: string) {}
}

export { UserGetResponse };
