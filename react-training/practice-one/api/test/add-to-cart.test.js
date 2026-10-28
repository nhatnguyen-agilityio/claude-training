// Tests for POST /carts/add-to-cart. Each test runs against its own temporary
// copy of db.json, so the real seed data is never touched.
const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { startTestServer } = require("../support/server-fixture");

const USER_ID = 999001;
const STOCK = 3;
const MISSING_ID = 999999;

let baseUrl;
let closeServer;
let productId;
let inStockVariantId;
let soldOutVariantId;

const addToCart = async (item) => {
    const res = await fetch(`${baseUrl}/carts/add-to-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, item }),
    });
    return { status: res.status, body: await res.json() };
};

beforeEach(async () => {
    // Set known stock values on the first product, in the copy only
    ({ baseUrl, close: closeServer } = await startTestServer((db) => {
        const product = db.products[0];
        productId = product.id;
        inStockVariantId = product.variants[0].id;
        soldOutVariantId = product.variants[1].id;
        product.variants[0].stock = STOCK;
        product.variants[1].stock = 0;
    }));
});

afterEach(async () => {
    await closeServer();
});

describe("POST /carts/add-to-cart stock check", () => {
    it("should return 400 with availableStock when a new row asks for more than the stock", async () => {
        const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity: STOCK + 1 });

        assert.equal(status, 400);
        assert.equal(body.error, "Insufficient stock");
        assert.equal(body.availableStock, STOCK);
    });

    it("should return 400 when a new row targets a variant with no stock", async () => {
        const { status, body } = await addToCart({ productId, variantId: soldOutVariantId, quantity: 1 });

        assert.equal(status, 400);
        assert.equal(body.availableStock, 0);
    });

    it("should return 201 when a new row is within the stock", async () => {
        const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity: STOCK });

        assert.equal(status, 201);
        assert.equal(body.item.quantity, STOCK);
    });

    it("should return 400 when an existing row is pushed over the stock", async () => {
        await addToCart({ productId, variantId: inStockVariantId, quantity: 2 });

        const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity: 2 });

        assert.equal(status, 400);
        assert.equal(body.availableStock, STOCK);
        assert.equal(body.requestedQuantity, 4);
    });

    it("should return 200 with the summed quantity when an existing row stays within the stock", async () => {
        await addToCart({ productId, variantId: inStockVariantId, quantity: 2 });

        const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity: 1 });

        assert.equal(status, 200);
        assert.equal(body.item.quantity, 3);
    });
});

describe("POST /carts/add-to-cart quantity check", () => {
    for (const quantity of [-5, "abc", "5", 2.5]) {
        it(`should return 400 when the quantity is ${JSON.stringify(quantity)}`, async () => {
            const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity });

            assert.equal(status, 400);
            assert.equal(body.error, "Quantity must be a positive whole number");
        });
    }

    it("should return 400 when the quantity is 0", async () => {
        const { status } = await addToCart({ productId, variantId: inStockVariantId, quantity: 0 });

        assert.equal(status, 400);
    });
});

describe("POST /carts/add-to-cart missing product or variant", () => {
    it("should return 404 when the product does not exist", async () => {
        const { status, body } = await addToCart({ productId: MISSING_ID, variantId: inStockVariantId, quantity: 1 });

        assert.equal(status, 404);
        assert.equal(body.error, "Product not found");
    });

    it("should return 404 when the variant does not exist", async () => {
        const { status, body } = await addToCart({ productId, variantId: MISSING_ID, quantity: 1 });

        assert.equal(status, 404);
        assert.equal(body.error, "Product variant not found");
    });
});
