import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Ensure SQLite database URL fallback or writable /tmp location on Vercel serverless
    let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      try {
        const tmpDb = '/tmp/dev.db';
        const projectDb = path.join(process.cwd(), 'prisma', 'dev.db');
        if (!fs.existsSync(tmpDb) && fs.existsSync(projectDb)) {
          fs.copyFileSync(projectDb, tmpDb);
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
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
