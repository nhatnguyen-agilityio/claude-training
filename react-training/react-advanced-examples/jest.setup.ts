import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";

Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
});

Object.defineProperty(global, 'TextDecoder', {
  value: NodeTextDecoder,
});
