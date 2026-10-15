import { TriangleAlert } from 'lucide-react';
import BreadcrumbComponent from '../common/Breadcrumb';
import Button from '../common/Button';
import PeopleViewed from '../PeopleViewed';

const ProductDetailError = () => {
  return (
    <div className="mt-12">
      <BreadcrumbComponent
        className="container"
        items={[
          { label: 'Homepage', href: '/' },
          { label: 'Product Detail', isCurrentPage: true },
        ]}
      />

      <div className="container mt-8">
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="mb-6">
            <TriangleAlert className="w-16 h-16 text-red-500 mx-aut" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Failed to load product
          </h2>
          <Button
            onClick={() => window.location.reload()}
            className="bg-app-primary hover:bg-app-tertiary text-white px-6 py-4 rounded-3xl"
          >
            Try Again
          </Button>
        </div>
      </div>
      <PeopleViewed />
    </div>
  );
};

export default ProductDetailError;
