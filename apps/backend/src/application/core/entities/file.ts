type FileConstructor = {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  expiration?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class File {
  private id: string;
  private filename: string;
  private originalName: string;
  private mimetype: string;
  private expiration?: Date;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(args: FileConstructor) {
    this.id = args.id;
    this.filename = args.filename;
    this.originalName = args.originalName;
    this.mimetype = args.mimetype;
    this.expiration = args.expiration;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public getId() {
    return this.id;
  }

  public getFilename() {
    return this.filename;
  }

  public getOriginalName() {
    return this.originalName;
  }

  public getMimetype() {
    return this.mimetype;
  }

  public getExpiration() {
    return this.expiration;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }
}
