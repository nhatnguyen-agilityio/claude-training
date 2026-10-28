// Tests for POST /carts/add-to-cart. Each test runs against its own temporary
// copy of db.json, so the real seed data is never touched.
const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { startTestServer } = require("../support/server-fixture");

const USER_ID = 999001;
const STOCK = 3;
const MISSING_ID = 999999;

const productId = 900001;
const inStockVariantId = 900101;
const soldOutVariantId = 900102;

let baseUrl;
let closeServer;

const addToCart = async (item) => {
    const res = await fetch(`${baseUrl}/carts/add-to-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, item }),
    });
    return { status: res.status, body: await res.json() };
};

const getCart = async () => {
    const res = await fetch(`${baseUrl}/carts?userId=${USER_ID}`);
    return res.json();
};

beforeEach(async () => {
    // Add our own product to the copy, so the tests do not depend on the seed data
    ({ baseUrl, close: closeServer } = await startTestServer((db) => {
        db.products.push({
            id: productId,
            name: "Test product",
            variants: [
                { id: inStockVariantId, stock: STOCK },
                { id: soldOutVariantId, stock: 0 },
            ],
        });
    }));
});

afterEach(async () => {
    await closeServer();
});

describe("POST /carts/add-to-cart stock check", () => {
    it("should return 400 with availableStock when a new row asks for more than the stock", async () => {
        const cartBefore = await getCart();

        const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity: STOCK + 1 });

        assert.equal(status, 400);
        assert.equal(body.error, "Insufficient stock");
        assert.equal(body.availableStock, STOCK);
        assert.deepEqual(await getCart(), cartBefore);
    });

    it("should return 400 when a new row targets a variant with no stock", async () => {
        const cartBefore = await getCart();

        const { status, body } = await addToCart({ productId, variantId: soldOutVariantId, quantity: 1 });

        assert.equal(status, 400);
        assert.equal(body.availableStock, 0);
        assert.deepEqual(await getCart(), cartBefore);
    });

    it("should return 201 when a new row is within the stock", async () => {
        const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity: STOCK });

        assert.equal(status, 201);
        assert.equal(body.item.quantity, STOCK);
    });

    it("should return 400 when an existing row is pushed over the stock", async () => {
        await addToCart({ productId, variantId: inStockVariantId, quantity: 2 });
        const cartBefore = await getCart();

        const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity: 2 });

        assert.equal(status, 400);
        assert.equal(body.availableStock, STOCK);
        assert.equal(body.requestedQuantity, 4);
        const cartAfter = await getCart();
        assert.deepEqual(cartAfter, cartBefore);
        assert.equal(cartAfter[0].item.quantity, 2);
    });

    it("should return 200 with the summed quantity when an existing row stays within the stock", async () => {
        await addToCart({ productId, variantId: inStockVariantId, quantity: 2 });

        const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity: 1 });

        assert.equal(status, 200);
        assert.equal(body.item.quantity, 3);
    });
});

describe("POST /carts/add-to-cart quantity check", () => {
    for (const quantity of [0, -5, "abc", "5", 2.5]) {
        it(`should return 400 when the quantity is ${JSON.stringify(quantity)}`, async () => {
            const cartBefore = await getCart();

            const { status, body } = await addToCart({ productId, variantId: inStockVariantId, quantity });

            assert.equal(status, 400);
            assert.equal(body.error, "Quantity must be a positive whole number");
            assert.deepEqual(await getCart(), cartBefore);
        });
    }

    it("should return 400 when the quantity is missing", async () => {
        const cartBefore = await getCart();

        const { status, body } = await addToCart({ productId, variantId: inStockVariantId });

        assert.equal(status, 400);
        assert.equal(body.error, "Missing required fields");
        assert.deepEqual(await getCart(), cartBefore);
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
