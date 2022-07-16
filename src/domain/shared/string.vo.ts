abstract class StringVO {
  readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}

export { StringVO };
