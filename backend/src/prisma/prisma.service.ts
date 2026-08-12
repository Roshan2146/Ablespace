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
        const path1 = path.join(process.cwd(), 'prisma', 'dev.db');
        const path2 = path.join(process.cwd(), 'backend', 'prisma', 'dev.db');
        const path3 = path.join(__dirname, '..', '..', 'prisma', 'dev.db');
        
        let existingDb = '';
        if (fs.existsSync(path1)) existingDb = path1;
        else if (fs.existsSync(path2)) existingDb = path2;
        else if (fs.existsSync(path3)) existingDb = path3;

        if (!fs.existsSync(tmpDb) && existingDb) {
          fs.copyFileSync(existingDb, tmpDb);
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
