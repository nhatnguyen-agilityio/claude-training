// Tests for PATCH /products/update-stock. Each test runs against its own
// temporary copy of db.json, so the real seed data is never touched.
const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { startTestServer } = require("../support/server-fixture");

const STOCK = 5;
const OTHER_STOCK = 7;
const SECOND_VARIANT_STOCK = 4;
const MISSING_ID = 999999;
const STRING_ID_STOCK = 6;
const STRING_PRODUCT_ID = "sofa-1";
const STRING_VARIANT_ID = "v1";

let baseUrl;
let closeServer;
let productId;
let otherProductId;
let variantId;
let secondVariantId;

const updateStock = async (items) => {
    const res = await fetch(`${baseUrl}/products/update-stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
    });
    return { status: res.status, body: await res.json() };
};

const getStock = async (pId, vId) => {
    const res = await fetch(`${baseUrl}/products/${pId}`);
    const product = await res.json();
    return product.variants.find((v) => v.id === vId).stock;
};

beforeEach(async () => {
    ({ baseUrl, close: closeServer } = await startTestServer((db) => {
        // Pick two products that share a variant id and set known stock, in the copy only
        const product = db.products[0];
        const otherProduct = db.products.find(
            (p) => p.id !== product.id && p.variants.some((v) => v.id === product.variants[0].id)
        );
        productId = product.id;
        otherProductId = otherProduct.id;
        variantId = product.variants[0].id;
        secondVariantId = product.variants[1].id;
        product.variants[0].stock = STOCK;
        product.variants[1].stock = SECOND_VARIANT_STOCK;
        otherProduct.variants.find((v) => v.id === variantId).stock = OTHER_STOCK;
        // A product whose ids are strings, to prove ids are not parsed as numbers
        db.products.push({
            ...product,
            id: STRING_PRODUCT_ID,
            variants: [{ ...product.variants[0], id: STRING_VARIANT_ID, stock: STRING_ID_STOCK }],
        });
    }));
});

afterEach(async () => {
    await closeServer();
});

describe("PATCH /products/update-stock", () => {
    it("should deduct only the requested product when the quantity fits the stock", async () => {
        const { status, body } = await updateStock([{ productId, variantId, quantity: 2 }]);

        assert.equal(status, 200);
        assert.equal(body.success, true);
        assert.equal(await getStock(productId, variantId), STOCK - 2);
    });

    it("should leave another product untouched when it shares the same variant id", async () => {
        await updateStock([{ productId, variantId, quantity: 2 }]);

        assert.equal(await getStock(otherProductId, variantId), OTHER_STOCK);
    });

    it("should deduct the second product when the request names it", async () => {
        await updateStock([{ productId: otherProductId, variantId, quantity: 3 }]);

        assert.equal(await getStock(otherProductId, variantId), OTHER_STOCK - 3);
        assert.equal(await getStock(productId, variantId), STOCK);
    });

    it("should return previousStock and newStock when the stock is deducted", async () => {
        const { body } = await updateStock([{ productId, variantId, quantity: 2 }]);

        assert.deepEqual(body.updated, [
            { productId, variantId, previousStock: STOCK, newStock: STOCK - 2, quantityDeducted: 2 },
        ]);
    });

    it("should return 400 and change nothing when the stock is short", async () => {
        const { status, body } = await updateStock([{ productId, variantId, quantity: STOCK + 1 }]);

        assert.equal(status, 400);
        assert.equal(body.success, false);
        assert.equal(body.errors[0].error, "Insufficient stock");
        assert.equal(await getStock(productId, variantId), STOCK);
        assert.equal(await getStock(otherProductId, variantId), OTHER_STOCK);
    });

    it("should not fall back to another product when the requested one is short of stock", async () => {
        // The other product has enough stock, but only the named product counts
        const { status } = await updateStock([{ productId, variantId, quantity: OTHER_STOCK }]);

        assert.equal(status, 400);
        assert.equal(await getStock(otherProductId, variantId), OTHER_STOCK);
    });

    it("should return 400 and not deduct the good item when another item in the batch is bad", async () => {
        const { status, body } = await updateStock([
            { productId, variantId, quantity: 1 },
            { productId, variantId: secondVariantId, quantity: SECOND_VARIANT_STOCK + 1 },
        ]);

        assert.equal(status, 400);
        assert.equal(body.success, false);
        assert.equal(body.errors.length, 1);
        assert.equal(await getStock(productId, variantId), STOCK);
        assert.equal(await getStock(productId, secondVariantId), SECOND_VARIANT_STOCK);
    });

    it("should sum the quantities and return 400 when the same item repeats beyond the stock", async () => {
        const { status } = await updateStock([
            { productId, variantId, quantity: STOCK - 1 },
            { productId, variantId, quantity: 2 },
        ]);

        assert.equal(status, 400);
        assert.equal(await getStock(productId, variantId), STOCK);
    });

    it("should deduct the summed quantity once when the same item repeats within the stock", async () => {
        const { status, body } = await updateStock([
            { productId, variantId, quantity: 1 },
            { productId, variantId, quantity: 2 },
        ]);

        assert.equal(status, 200);
        assert.equal(body.updated.length, 1);
        assert.equal(body.updated[0].quantityDeducted, 3);
        assert.equal(await getStock(productId, variantId), STOCK - 3);
    });

    for (const [label, quantity] of [
        ["zero", 0],
        ["negative", -1],
        ["a decimal", 2.5],
        ["a string", "2"],
    ]) {
        it(`should return 400 and change nothing when the quantity is ${label}`, async () => {
            const { status, body } = await updateStock([{ productId, variantId, quantity }]);

            assert.equal(status, 400);
            assert.equal(body.success, false);
            assert.equal(await getStock(productId, variantId), STOCK);
        });
    }

    it("should return 400 when productId is missing", async () => {
        const { status, body } = await updateStock([{ variantId, quantity: 1 }]);

        assert.equal(status, 400);
        assert.equal(body.success, false);
        assert.equal(await getStock(productId, variantId), STOCK);
        assert.equal(await getStock(otherProductId, variantId), OTHER_STOCK);
    });

    it("should return 400 and change nothing when the product does not exist", async () => {
        const { status, body } = await updateStock([{ productId: MISSING_ID, variantId, quantity: 1 }]);

        assert.equal(status, 400);
        assert.equal(body.errors[0].error, "Product not found");
        assert.equal(await getStock(productId, variantId), STOCK);
        assert.equal(await getStock(otherProductId, variantId), OTHER_STOCK);
    });

    it("should return 400 when the variant does not exist in the product", async () => {
        const { status, body } = await updateStock([{ productId, variantId: MISSING_ID, quantity: 1 }]);

        assert.equal(status, 400);
        assert.equal(body.errors[0].error, "Product variant not found");
    });

    it("should deduct a product with string ids when it follows a numeric item in the batch", async () => {
        const { status, body } = await updateStock([
            { productId, variantId, quantity: 1 },
            { productId: STRING_PRODUCT_ID, variantId: STRING_VARIANT_ID, quantity: 2 },
        ]);

        assert.equal(status, 200);
        assert.deepEqual(body.updated[1], {
            productId: STRING_PRODUCT_ID,
            variantId: STRING_VARIANT_ID,
            previousStock: STRING_ID_STOCK,
            newStock: STRING_ID_STOCK - 2,
            quantityDeducted: 2,
        });
        assert.equal(await getStock(productId, variantId), STOCK - 1);
        assert.equal(await getStock(STRING_PRODUCT_ID, STRING_VARIANT_ID), STRING_ID_STOCK - 2);
    });

    it("should write nothing when a later item with string ids is short of stock", async () => {
        const { status, body } = await updateStock([
            { productId, variantId, quantity: 1 },
            { productId: STRING_PRODUCT_ID, variantId: STRING_VARIANT_ID, quantity: STRING_ID_STOCK + 1 },
        ]);

        assert.equal(status, 400);
        assert.equal(body.errors[0].index, 1);
        assert.equal(body.errors[0].available, STRING_ID_STOCK);
        assert.equal(body.errors[0].requested, STRING_ID_STOCK + 1);
        assert.equal(await getStock(productId, variantId), STOCK);
        assert.equal(await getStock(STRING_PRODUCT_ID, STRING_VARIANT_ID), STRING_ID_STOCK);
    });
});
