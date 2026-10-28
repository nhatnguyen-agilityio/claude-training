import { useCallback } from 'react';
import BreadcrumbComponent from '../../components/common/Breadcrumb';
import PeopleViewed from '../../components/PeopleViewed';
import ProductImageGallery from '../../components/ProductImageGallery';
import ProductInfo from '../../components/ProductInfo';
import ProductDetailSkeleton from '../../components/ProductDetailSkeleton';
import ProductDetailError from '../../components/ProductDetailError';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetProductDetail } from '../../apis/product-detail';
import { useAddCart } from '../../apis/add-cart';
import { GetMainCategories } from '../../apis/main-categories';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import NotFound from '../../components/NotFound';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { mutate, isLoading } = useAddCart();
  const variantIdParam = searchParams.get('variantId');

  const {
    data: productDetail,
    isPending,
    isError,
    error,
  } = useGetProductDetail(id || '', !!id);

  const { data: mainCategories } = GetMainCategories();

  const getBreadcrumbItems = () => {
    const items: { label: string; href?: string; isCurrentPage?: boolean }[] = [
      { label: 'Homepage', href: '/' },
    ];

    if (productDetail && mainCategories) {
      const category = mainCategories.find(
        (cat: { id: number; name: string }) =>
          cat.id === productDetail.mainCategoryId,
      );
      if (category) {
        items.push({
          label: category.name,
          href: `/products?categoryId=${category.id}&categoryTitle=${encodeURIComponent(category.name)}`,
        });
      }

      items.push({
        label: productDetail.name,
        isCurrentPage: true,
      });
    }

    return items;
  };

  const handleAddToCart = useCallback(
    (variantId: number, quantity: number) => {
      if (!user) {
        toast('You must be logged in to perform this action', {});
        return;
      }

      if (!user?.id) return;

      const cartPayload = {
        userId: user.id,
        item: {
          productId: Number(id),
          variantId,
          quantity,
        },
      };

      mutate(cartPayload, {
        onSuccess: () => {
          toast(`Product ${productDetail?.name} has been added to your cart`, {
            className: 'text-left',
          });
        },
        onError: (error: unknown) => {
          if (
            (error as { message?: string })?.message === 'Insufficient stock'
          ) {
            const variant = productDetail?.variants.find((v: { id: number; }) => v.id === variantId);
            const availableStock = variant?.stock || 0;
            toast.error(
              `Sorry, only ${availableStock} item(s) available in stock for ${productDetail?.name}. Please help check to your cart`,
              {
                className: 'text-left',
              },
            );
          } else {
            toast('Failed to add product to cart. Please try again.', {
              className: 'text-left',
            });
          }
        },
      });
    },
    [id, mutate, user, productDetail?.name, productDetail?.variants],
  );

  if (isPending) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    if (error?.message === 'Product not found') {
      return <NotFound />;
    }
    return <ProductDetailError />;
  }

  // Find the selected variant based on URL parameter
  const getSelectedVariantImages = () => {
    if (variantIdParam) {
      const variant = productDetail.variants.find(
        (v: { id: number }) => v.id === Number(variantIdParam)
      );
      if (variant) {
        return variant.images || [];
      }
    }
    return productDetail.variants[0]?.images || [];
  };

  return (
    <div className="mt-12">
      <BreadcrumbComponent className="container" items={getBreadcrumbItems()} />

      <div className="container mt-4 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 lg:gap-7">
          <ProductImageGallery images={getSelectedVariantImages()} />
          <ProductInfo
            name={productDetail.name}
            rating={productDetail.rating}
            price={productDetail.price}
            basePrice={productDetail.basePrice}
            description={productDetail.description}
            variants={productDetail.variants}
            userId={user?.id ? String(user.id) : undefined}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
      <PeopleViewed categoryId={productDetail.mainCategoryId} />
    </div>
  );
};

export default ProductDetail;
