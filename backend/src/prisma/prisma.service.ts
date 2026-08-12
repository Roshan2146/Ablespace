import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      try {
        const tmpDb = '/tmp/dev.db';
        const searchPaths = [
          path.join(process.cwd(), 'backend', 'prisma', 'dev.db'),
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
          path.join(__dirname, '..', 'prisma', 'dev.db'),
        ];

        const existingDb = searchPaths.find((p) => fs.existsSync(p));

        if (!fs.existsSync(tmpDb) && existingDb) {
          fs.copyFileSync(existingDb, tmpDb);
          console.log(`Copied SQLite database from ${existingDb} to ${tmpDb}`);
        }
        if (fs.existsSync(tmpDb)) {
          dbUrl = 'file:/tmp/dev.db';
        }
      } catch (err) {
        console.warn('Vercel sqlite temp file copy warning:', err);
      }
    }

    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e) {
      console.error('Prisma connection error:', e);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
