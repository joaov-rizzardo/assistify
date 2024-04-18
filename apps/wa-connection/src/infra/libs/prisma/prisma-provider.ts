import { PrismaClient } from '@assistify/prisma';

export class PrismaProvider {
  private static instance?: PrismaProvider;
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  public get client(): PrismaClient {
    return this.prismaClient;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}
