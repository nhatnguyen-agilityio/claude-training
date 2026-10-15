import type { CSSProperties } from 'react';

const Image = ({
  src,
  alt = '',
  width = '',
  height = '',
  className = '',
  loading = 'lazy',
  decoding = 'async',
  sizes = '',
  style = {},
  fetchPriority,
}: {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync';
  sizes?: string;
  style?: CSSProperties;
  fetchPriority?: 'high' | 'low' | 'auto';
}) => {
  return (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={className}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      style={style}
      fetchPriority={fetchPriority}
    />
  );
};

export default Image;
