import defaultValue, {bar, foo} from './index';

jest.mock('./index', () => {
  const originalModule = jest.requireActual('./index');

  return {
    __esModule: true,
    ...originalModule,
    foo:'mocked foo',
    default: jest.fn(() => 'mocked baz'),
  };
});

test('mocked default export', () => {
  const mockedDefault = defaultValue();
  expect(mockedDefault).toBe('mocked baz');
  expect(defaultValue).toHaveBeenCalled();
  expect(foo).toBe('mocked foo');
  expect(bar()).toBe('bar');
});

const myMockFn = jest
  .fn(() => 'default mock')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call')
  .mockName('myMockFnnn');

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
