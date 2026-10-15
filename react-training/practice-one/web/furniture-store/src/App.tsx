import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import ScrollToTop from './components/ScrollToTop';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { API_STALE_TIME } from './constants/api';
import Loading from './components/Loading';
import { AuthProvider } from './auth/AuthProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Main from './pages/main';
const Home = lazy(() => import('./pages/home'));
const Products = lazy(() => import('./pages/products'));
const ProductDetail = lazy(() => import('./pages/productDetail'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: API_STALE_TIME,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Main />}>
                  <Route
                    index
                    element={
                      <ErrorBoundary>
                        <Home />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="products"
                    element={
                      <ErrorBoundary>
                        <Products />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="products/:id"
                    element={
                      <ErrorBoundary>
                        <ProductDetail />
                      </ErrorBoundary>
                    }
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
