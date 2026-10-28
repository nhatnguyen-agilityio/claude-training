// Starts the json-server API on a throwaway copy of db.json so e2e runs never touch the real data
import { spawn } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../api',
);
if (!existsSync(path.join(apiDir, 'node_modules'))) {
  console.error('Missing api/node_modules: run `pnpm install` in api first');
  process.exit(1);
}

const workDir = mkdtempSync(path.join(tmpdir(), 'furniture-e2e-api-'));

copyFileSync(path.join(apiDir, 'server.js'), path.join(workDir, 'server.js'));
symlinkSync(
  path.join(apiDir, 'node_modules'),
  path.join(workDir, 'node_modules'),
  'dir',
);

const db = JSON.parse(readFileSync(path.join(apiDir, 'db.json'), 'utf8'));
// Known stock for the products the e2e specs depend on, set in the copy only:
// product 1 (add-to-cart-stock) and product 8 (checkout-stock) both have a
// variant 101, so the checkout spec can prove only the bought product is deducted
const testStock = {
  1: { 101: 2, 102: 0 },
  8: { 101: 5 },
};
for (const [productId, variantStock] of Object.entries(testStock)) {
  const product = db.products.find((p) => p.id === Number(productId));
  if (!product) {
    console.error(`Seed db.json has no product ${productId}, which e2e needs`);
    process.exit(1);
  }
  for (const [variantId, stock] of Object.entries(variantStock)) {
    const variant = product.variants.find((v) => v.id === Number(variantId));
    if (!variant) {
      console.error(
        `Seed product ${productId} has no variant ${variantId}, which e2e needs`,
      );
      process.exit(1);
    }
    variant.stock = stock;
  }
}
db.carts = [];
writeFileSync(path.join(workDir, 'db.json'), JSON.stringify(db, null, 2));

const server = spawn(process.execPath, ['server.js'], {
  cwd: workDir,
  env: { ...process.env, PORT: process.env.E2E_API_PORT },
  stdio: 'inherit',
});

const stop = () => server.kill();
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
server.on('exit', (code) => {
  rmSync(workDir, { recursive: true, force: true });
  process.exit(code ?? 0);
});
