import { Reactotron } from 'reactotron-core-client';

declare global {
  interface Console {
    tron: Reactotron;
  }
}
