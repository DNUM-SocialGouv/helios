#!/usr/bin/env node
/* eslint-disable no-console */
// src/bin/migrate.ts
// Script de migration pour appliquer ou annuler les migrations de la base de données

import 'reflect-metadata';
import 'dotenv/config';
import AppDataSource from '../../database/dataSource';

async function main() {
  const cmd = process.argv[2] || 'up';

  try {
    await AppDataSource.initialize();

    if (cmd === 'up') {
      console.log('Running migrations...');
      const migrations: any[] = await (AppDataSource as any).runMigrations();
      console.log('Migrations applied:', migrations.map((m: any) => m.name).join(', ') || 'none');
    } else if (cmd === 'down') {
      console.log('Reverting last migration...');
      const reverted: any = await (AppDataSource as any).undoLastMigration();
      console.log('Migration reverted:', reverted?.name || 'none');
    } else {
      console.error('Unknown command:', cmd);
      process.exit(2);
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error(err);
    try {
      await AppDataSource.destroy();
    } catch { }
    process.exit(1);
  }
}

main();

