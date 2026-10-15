// server.js
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 5001;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// api to handle signup
server.post("/signup", (req, res) => {
    const {
        username,
        password,
        name = "",
        email = "",
        address = "",
        phone = "",
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const users = router.db.get("users").value();
    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
        return res.status(400).json({ error: "Username already used. Please use another username or contact support team for help" });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        username,
        password,
        name,
        email,
        address,
        phone,
    };

    router.db.get("users").push(newUser).write();

    return res.status(201).json(newUser);
});

// api to handle login
server.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const users = router.db.get("users").value();
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
        user: userWithoutPassword,
    });
});

// api to handle delete all carts by user
server.delete("/carts/users/:userId", (req, res) => {
    const { userId } = req.params;
    router.db
        .get("carts")
        .remove({ userId: Number(userId) })
        .write();
    return res.status(200).json({ message: "All carts deleted for userId " + userId });
});

// Custom route: add to cart
server.post("/carts/add-to-cart", (req, res) => {
    const db = router.db; // lowdb instance
    const { userId, item, createdAt } = req.body;

    if (!userId || !item || !item.productId || !item.variantId || !item.quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if cart already exists
    const existingCart = db
        .get("carts")
        .find(c =>
            c.userId === userId &&
            c.item.productId === item.productId &&
            c.item.variantId === item.variantId
        )
        .value();

    if (existingCart) {
        // Find the product variant to check stock
        const product = db
            .get("products")
            .find({ id: item.productId })
            .value();

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const variant = product.variants.find(v => v.id === item.variantId);

        if (!variant) {
            return res.status(404).json({ error: "Product variant not found" });
        }

        const newQuantity = existingCart.item.quantity + item.quantity;

        if (newQuantity > variant.stock) {
            return res.status(400).json({
                error: "Insufficient stock",
                availableStock: variant.stock,
                requestedQuantity: newQuantity
            });
        }

        // Update quantity
        const updated = db
            .get("carts")
            .find({ id: existingCart.id })
            .assign({
                item: {
                    ...existingCart.item,
                    quantity: newQuantity,
                },
            })
            .write();

        return res.json(updated);
    } else {
        // Create new row
        const newCart = {
            userId,
            item,
            createdAt: createdAt || new Date().toISOString(),
        };

        const inserted = db.get("carts").insert(newCart).write();
        return res.status(201).json(inserted);
    }
});

// API to handle stock updates after order
server.patch("/products/update-stock", (req, res) => {
    const db = router.db; // lowdb instance
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Items array is required" });
    }

    const updateResults = [];
    const errors = [];

    // Process each item update
    for (const updateItem of items) {
        const { variantId, quantity } = updateItem;

        if (!variantId || !quantity || quantity <= 0) {
            errors.push({
                variantId,
                error: "Invalid variantId or quantity"
            });
            continue;
        }

        try {
            // Find the product containing this variant
            const products = db.get("products").value();
            let productFound = false;
            let variantFound = false;

            for (const product of products) {
                const variantIndex = product.variants.findIndex(v => v.id === variantId);

                if (variantIndex !== -1) {
                    const variant = product.variants[variantIndex];
                    productFound = true;
                    variantFound = true;

                    // Check if enough stock available
                    if (variant.stock < quantity) {
                        errors.push({
                            variantId,
                            error: "Insufficient stock",
                            available: variant.stock,
                            requested: quantity
                        });
                        continue;
                    }

                    // Update stock
                    const newStock = variant.stock - quantity;

                    // Update the variant in database
                    db.get("products")
                        .find({ id: product.id })
                        .get("variants")
                        .find({ id: variantId })
                        .assign({ stock: newStock })
                        .write();

                    updateResults.push({
                        variantId,
                        previousStock: variant.stock,
                        newStock,
                        quantityDeducted: quantity
                    });

                    break;
                }
            }

            if (!productFound || !variantFound) {
                errors.push({
                    variantId,
                    error: "Product variant not found"
                });
            }
        } catch (error) {
            errors.push({
                variantId,
                error: "Failed to update stock: " + error.message
            });
        }
    }

    // Return results
    const response = {
        success: updateResults.length > 0,
        updated: updateResults,
        errors: errors.length > 0 ? errors : undefined
    };

    const statusCode = errors.length > 0 && updateResults.length === 0 ? 400 : 200;
    return res.status(statusCode).json(response);
});

// Custom API endpoint to get products with stock > 0
server.get("/products/with-stock", (req, res) => {
    const db = router.db;
    const {
        _start = "0",
        _end = "20",
        _sort = "createdAt",
        _order = "desc",
        mainCategoryId,
        subCategoryId,
        name_like,
    } = req.query;

    try {
        // Get all products
        let products = db.get("products").value();

        // Filter products that have at least one variant with stock > 0
        const productsWithStock = products.filter(product => {
            if (!product.variants || !Array.isArray(product.variants)) {
                return false;
            }

            // Check if any variant has stock > 0
            const totalStock = product.variants.reduce((sum, variant) => {
                return sum + (variant.stock || 0);
            }, 0);

            return totalStock > 0;
        });

        // Apply additional filters
        let filteredProducts = productsWithStock;

        if (mainCategoryId) {
            filteredProducts = filteredProducts.filter(
                p => p.mainCategoryId === parseInt(mainCategoryId)
            );
        }

        if (subCategoryId && subCategoryId !== 'All') {
            filteredProducts = filteredProducts.filter(
                p => p.subCategoryId === parseInt(subCategoryId)
            );
        }

        if (name_like) {
            filteredProducts = filteredProducts.filter(
                p => p.name && p.name.toLowerCase().includes(name_like.toLowerCase())
            );
        }

        // Apply sorting
        if (_sort && filteredProducts.length > 0) {
            filteredProducts.sort((a, b) => {
                let aVal = a[_sort];
                let bVal = b[_sort];

                // Handle different data types
                if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                if (typeof bVal === 'string') bVal = bVal.toLowerCase();

                if (_order === 'desc') {
                    return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                } else {
                    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                }
            });
        }

        // Apply pagination
        const start = parseInt(_start);
        const end = parseInt(_end);
        const paginatedProducts = filteredProducts.slice(start, end);

        // Set headers like json-server does
        res.set('X-Total-Count', filteredProducts.length.toString());
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');

        return res.status(200).json(paginatedProducts);
    } catch (error) {
        return res.status(500).json({
            error: "Failed to fetch products with stock",
            message: error.message
        });
    }
});

server.use(router);

server.listen(PORT, () => {
    console.log(`✅ JSON Server is running on port ${PORT}`);
});
