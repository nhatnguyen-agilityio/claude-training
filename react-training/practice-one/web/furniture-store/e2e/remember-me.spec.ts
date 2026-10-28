import { expect, test } from '@playwright/test';
import { login, logout, otherUser, readAuthUser, seedUser } from './helpers';

const storedUser = () => ({ id: seedUser.id, username: seedUser.username });
const otherStoredUser = () => ({
  id: otherUser.id,
  username: otherUser.username,
});

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

  for (const [label, remember] of [
    ['with remember me ticked', true],
    ['with remember me unticked', false],
  ] as const) {
    test(`should clear both storages when the user logs out after logging in ${label}`, async ({
      page,
    }) => {
      await login(page, { remember });
      // The user sits in one storage before logout: local if ticked, else session
      const { local, session } = await readAuthUser(page);
      expect(JSON.parse((remember ? local : session) ?? 'null')).toEqual(
        storedUser(),
      );

      await logout(page);

      expect(await readAuthUser(page)).toEqual({ local: null, session: null });

      await page.reload();
      await expect(
        page.getByRole('button', { name: 'Get Started' }),
      ).toBeVisible();
      expect(await readAuthUser(page)).toEqual({ local: null, session: null });
    });
  }

  test('should keep the remembered user and clear the tab user when both are stored on reload', async ({
    page,
  }) => {
    await page.evaluate(
      ([remembered, tabUser]) => {
        localStorage.setItem('authUser', remembered);
        sessionStorage.setItem('authUser', tabUser);
      },
      [JSON.stringify(storedUser()), JSON.stringify(otherStoredUser())],
    );

    await page.reload();

    await expect(page.getByRole('button', { name: 'User' })).toBeVisible();
    await expect
      .poll(async () => {
        const { local, session } = await readAuthUser(page);
        return { local: JSON.parse(local ?? 'null'), session };
      })
      .toEqual({ local: storedUser(), session: null });
  });
});
