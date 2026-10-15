import ProductInterface from "./product";

interface ProductTableInterface {
    products: ProductInterface[],
    filterText: string,
    inStockOnly: boolean
}

export default ProductTableInterface;