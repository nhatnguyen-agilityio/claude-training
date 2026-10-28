import ProductCategoryInterface from "../../../../interfaces/productCategory";

const ProductCategory = (category: ProductCategoryInterface) => {
  return (
    <tr>
      <th>{category.category}</th>
    </tr>
  );
}
export default ProductCategory;