import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, type Page } from '@playwright/test';

interface SeedUser {
  id: number;
  username: string;
  password: string;
}

const dbPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../api/db.json',
);

// Read the seed user from the data instead of hard-coding credentials
export const seedUser: SeedUser = JSON.parse(readFileSync(dbPath, 'utf8'))
  .users[0];

export const login = async (page: Page, { remember = false } = {}) => {
  await page.getByRole('button', { name: 'Get Started' }).click();
  await page.getByPlaceholder('Username').fill(seedUser.username);
  await page.getByPlaceholder('Password').fill(seedUser.password);
  if (remember) {
    await page.getByRole('checkbox', { name: 'Remember me' }).click();
  }
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('button', { name: 'User' })).toBeVisible();
};

export const logout = async (page: Page) => {
  await page.getByRole('button', { name: 'User' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
};

export const readAuthUser = (page: Page) =>
  page.evaluate(() => ({
    local: localStorage.getItem('authUser'),
    session: sessionStorage.getItem('authUser'),
  }));

export const productDetail = (page: Page) =>
  page
    .locator('div')
    .filter({ has: page.getByRole('heading', { level: 2 }) })
    .filter({ has: page.getByRole('spinbutton', { name: 'Quantity' }) })
    .last();
