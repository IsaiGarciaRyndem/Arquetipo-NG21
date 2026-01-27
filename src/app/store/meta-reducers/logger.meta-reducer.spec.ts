import { loggerMetaReducer } from './logger.meta-reducer';

describe('loggerMetaReducer', () => {
  it('debe delegar al reducer original', () => {
    const base = jest.fn((state: number | undefined) => (state ?? 0) + 1);
    const wrapped = loggerMetaReducer(base);

    const result = wrapped(0, { type: 'X' });
    expect(result).toBe(1);
    expect(base).toHaveBeenCalled();
  });
});
