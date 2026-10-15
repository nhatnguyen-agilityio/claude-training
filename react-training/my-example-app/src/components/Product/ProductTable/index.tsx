import ProductCategory from "./ProductCategory";
import ProductItem from "./ProductItem";
import { JSX } from "react";
import ProductTableInterface from "../../../interfaces/productTable";

const ProductTable = ({ products, filterText, inStockOnly }: ProductTableInterface) => {
  const rows: JSX.Element[] = [];
  let lastCategory: string | null = null;
  products.forEach((item) => {
    if (item.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }

    if (inStockOnly && !item.stocked) {
      return;
    }

    if (item.category !== lastCategory) {
      rows.push(
        <ProductCategory category={item.category} key={item.category} />
      )
    }

    rows.push(
      <ProductItem
        product={item} key={item.name}
      />
    );

    lastCategory = item.category;
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}
export default ProductTable;