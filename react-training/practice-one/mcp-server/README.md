# furniture-store MCP server

A small, **read-only** [MCP](https://modelcontextprotocol.io) server that lets Claude look up the furniture-store's products and stock.
It reads from the json-server API in `../api` and never writes. `api/db.json` is shared seed data.

Built with the MCP Python SDK (`FastMCP`), following Anthropic Academy's *Introduction to Model Context Protocol*.

## What it offers

| Kind | Name | What it does |
|---|---|---|
| Tool | `get_product_stock(product_id)` | Stock for each variant of one product, plus the total |
| Tool | `find_low_stock(threshold=5, main_category_id=None)` | Variants with stock at or below the threshold |
| Resource | `store://categories` | All main categories |
| Resource | `store://products` | All products (`id`, `name`, `price`) |
| Resource template | `store://products/{product_id}` | One product with its variants and stock |
| Prompt | `low_stock_report(threshold="5")` | Low-stock report grouped by category, with restock suggestions |

## Run it

1. Start the API: `cd ../api && pnpm start` (port 5001). Set `FURNITURE_API_URL` to use another address.
2. Install dependencies once: `uv sync`.

### Test in the MCP Inspector

```bash
uv run mcp dev server.py
```
Open the URL it prints (it includes the auth token), switch the server on, and try the **Tools**, **Resources** and **Prompts** tabs.

> The current inspector (2.x) asks for Node ≥ 22.19. It also runs on Node 20, with warnings.

### Use it in Claude Code

The server is registered in `../.mcp.json` (project scope). Start `claude` from `react-training/practice-one` and approve `furniture-store` when asked, or run `/mcp`. Then:
- Ask: *"Which products are low on stock?"*. Claude calls `find_low_stock`.
- Mention a resource: `@furniture-store:store://products/1`
- Run the prompt: `/mcp__furniture-store__low_stock_report`

## Notes

- The SDK is pinned to `mcp < 2` so the code matches the course. In `mcp` 2.x, `FastMCP` was renamed to `MCPServer` (`from mcp.server.mcpserver import MCPServer`), and some other APIs changed.
- If the API isn't running, tools return a clear "API is not running" error instead of crashing.
