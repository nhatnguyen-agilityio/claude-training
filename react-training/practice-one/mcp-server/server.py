"""Read-only MCP server for the furniture-store app.

Reads products, categories and stock from the json-server API in ../api
(start it with `pnpm start` there). It never writes: api/db.json is shared seed data.
"""

import os

import httpx
from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.prompts import base
from pydantic import Field

API_URL = os.environ.get("FURNITURE_API_URL", "http://localhost:5001").rstrip("/")

mcp = FastMCP("furniture-store", log_level="ERROR")


async def api_get(path: str, params: dict | None = None):
    """GET a JSON response from the furniture-store API with a clear error if it's down."""
    try:
        async with httpx.AsyncClient(base_url=API_URL, timeout=10) as client:
            res = await client.get(path, params=params)
    except httpx.ConnectError:
        raise ValueError(
            f"The furniture-store API is not running at {API_URL}. "
            "Start it with `pnpm start` in react-training/practice-one/api."
        )
    if res.status_code == 404:
        raise ValueError(f"Not found: {path}")
    res.raise_for_status()
    return res.json()


async def get_product(product_id: int) -> dict:
    return await api_get(f"/products/{product_id}")


def variant_summary(variant: dict) -> dict:
    return {
        "variant_id": variant["id"],
        "color": variant.get("color"),
        "size": variant.get("size"),
        "stock": variant.get("stock", 0),
    }


# ---------- Tools (Claude decides when to call them) ----------


@mcp.tool(
    name="get_product_stock",
    description="Get the stock of every variant (color/size) of one product, plus the product's total stock.",
)
async def get_product_stock(
    product_id: int = Field(description="Id of the product, e.g. 1"),
) -> dict:
    product = await get_product(product_id)
    variants = [variant_summary(v) for v in product.get("variants", [])]
    return {
        "product_id": product["id"],
        "name": product["name"],
        "total_stock": sum(v["stock"] for v in variants),
        "variants": variants,
    }


@mcp.tool(
    name="find_low_stock",
    description=(
        "Find product variants whose stock is at or below a threshold, across the whole store "
        "or within one main category. Use it to answer questions about low or sold-out stock."
    ),
)
async def find_low_stock(
    threshold: int = Field(default=5, description="Report variants with stock less than or equal to this number"),
    main_category_id: int | None = Field(
        default=None, description="Only check products in this main category id (see the store://categories resource)"
    ),
) -> list[dict]:
    params = {"mainCategoryId": main_category_id} if main_category_id is not None else None
    products = await api_get("/products", params)
    categories = {c["id"]: c["name"] for c in await api_get("/mainCategories")}

    low = []
    for product in products:
        for variant in product.get("variants", []):
            if variant.get("stock", 0) <= threshold:
                low.append(
                    {
                        "product_id": product["id"],
                        "product_name": product["name"],
                        "category": categories.get(product.get("mainCategoryId"), "Unknown"),
                        **variant_summary(variant),
                    }
                )
    return sorted(low, key=lambda item: item["stock"])


# ---------- Resources (the user @-mentions them) ----------


@mcp.resource("store://categories", mime_type="application/json")
async def list_categories() -> list[dict]:
    """All main categories as {id, name}."""
    return [{"id": c["id"], "name": c["name"]} for c in await api_get("/mainCategories")]


@mcp.resource("store://products", mime_type="application/json")
async def list_products() -> list[dict]:
    """All products as {id, name, price}."""
    return [{"id": p["id"], "name": p["name"], "price": p["price"]} for p in await api_get("/products")]


@mcp.resource("store://products/{product_id}", mime_type="application/json")
async def product_detail(product_id: str) -> dict:
    """One product with its variants and stock (images left out to keep it short)."""
    product = await get_product(int(product_id))
    return {
        "id": product["id"],
        "name": product["name"],
        "price": product["price"],
        "main_category_id": product.get("mainCategoryId"),
        "sale": product.get("sale"),
        "variants": [variant_summary(v) for v in product.get("variants", [])],
    }


# ---------- Prompts (the user runs them with /) ----------


@mcp.prompt(
    name="low_stock_report",
    description="Write a low-stock report for the store, grouped by category, with restock suggestions.",
)
def low_stock_report(
    threshold: str = Field(default="5", description="Stock level at or below which a variant counts as low"),
) -> list[base.Message]:
    prompt = f"""
Write a low-stock report for the furniture store.

<threshold>
{threshold}
</threshold>

Steps:
1. Call the `find_low_stock` tool with this threshold.
2. Group the results by category. For each category, show a markdown table with the
   columns: Product, Variant (color / size), Stock. Mark stock 0 as **Sold out**.
3. End with one short restock suggestion per category, most urgent first.

If nothing is low, say so in one sentence. Use only the tool's data; don't guess numbers.
"""
    return [base.UserMessage(prompt)]


if __name__ == "__main__":
    mcp.run()
