import { expect, test } from '@playwright/test';
import { login, logout, readAuthUser, seedUser } from './helpers';

const storedUser = () => ({ id: seedUser.id, username: seedUser.username });

test.describe('Login remember me', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should leave remember me unticked when the login form opens', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Get Started' }).click();

    await expect(
      page.getByRole('checkbox', { name: 'Remember me' }),
    ).not.toBeChecked();
  });

  test('should tick remember me when the label is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Get Started' }).click();
    await page.getByText('Remember me', { exact: true }).click();

    await expect(
      page.getByRole('checkbox', { name: 'Remember me' }),
    ).toBeChecked();
  });

  test('should keep the user only for this tab when remember me is unticked', async ({
    page,
    context,
  }) => {
    await login(page);

    const { local, session } = await readAuthUser(page);
    expect(local).toBeNull();
    expect(JSON.parse(session ?? 'null')).toEqual(storedUser());

    await page.reload();
    await expect(page.getByRole('button', { name: 'User' })).toBeVisible();

    const newPage = await context.newPage();
    await newPage.goto('/');
    await expect(
      newPage.getByRole('button', { name: 'Get Started' }),
    ).toBeVisible();
  });

  test('should keep the user across tabs when remember me is ticked', async ({
    page,
    context,
  }) => {
    await login(page, { remember: true });

    const { local, session } = await readAuthUser(page);
    expect(session).toBeNull();
    expect(JSON.parse(local ?? 'null')).toEqual(storedUser());

    const newPage = await context.newPage();
    await newPage.goto('/');
    await expect(newPage.getByRole('button', { name: 'User' })).toBeVisible();
  });

  test('should clear both storages when the user logs out', async ({
    page,
  }) => {
    await login(page, { remember: true });
    await logout(page);

    expect(await readAuthUser(page)).toEqual({ local: null, session: null });

    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Get Started' }),
    ).toBeVisible();
    expect(await readAuthUser(page)).toEqual({ local: null, session: null });
  });
});
