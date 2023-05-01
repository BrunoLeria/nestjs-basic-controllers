export abstract class MockModel<T> {
  protected abstract abstractStub: T;

  constructor(createAbstractData: T) {
    this.constructorSpy(createAbstractData);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructorSpy(_createAbstractData: T): void {}

  findOne(): { exec: () => T } {
    return {
      exec: (): T => this.abstractStub,
    };
  }

  async find(): Promise<T[]> {
    return [this.abstractStub];
  }

  async save(): Promise<T> {
    return this.abstractStub;
  }

  async findOneAndUpdate(): Promise<T> {
    return this.abstractStub;
  }

  async findOneAndDelete(): Promise<object> {
    return { deletedCount: 1 };
  }
}
