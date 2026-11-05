import BirthDate from './__mocks__/BirthDate';

describe('DateValueObject', () => {
  const validDateStr = '2024-05-15T10:00:00.000Z';
  const earlierDateStr = '2024-01-01T00:00:00.000Z';
  const laterDateStr = '2024-12-31T23:59:59.000Z';
  const invalidDateStr = 'fecha-invalida';

  it('should instantiate successfully with a valid date', () => {
    const date = new BirthDate(validDateStr);
    expect(date).toBeInstanceOf(BirthDate);
    expect(date.value).toBe(new Date(validDateStr).toISOString());
  });

  it('should throw an error when instantiating with an invalid date', () => {
    expect(() => new BirthDate(invalidDateStr)).toThrow(
      `The date: ${invalidDateStr} is not a valid date`
    );
  });

  it('should correctly format date to ISO string', () => {
    const date = new BirthDate(validDateStr);
    expect(date.format(validDateStr)).toBe(new Date(validDateStr).toISOString());
  });

  it('should return true when the date is before another date', () => {
    const date = new BirthDate(earlierDateStr);
    expect(date.isBeforeThisDate(validDateStr)).toBe(true);
  });

  it('should return false when the date is not before another date', () => {
    const date = new BirthDate(laterDateStr);
    expect(date.isBeforeThisDate(validDateStr)).toBe(false);
  });

  it('should return true when the date is after another date', () => {
    const date = new BirthDate(laterDateStr);
    expect(date.isAfterThisDate(validDateStr)).toBe(true);
  });

  it('should return false when the date is not after another date', () => {
    const date = new BirthDate(earlierDateStr);
    expect(date.isAfterThisDate(validDateStr)).toBe(false);
  });

  it('should return true when date is between two dates', () => {
    const date = new BirthDate(validDateStr);
    expect(date.isBetweenTheDates(earlierDateStr, laterDateStr)).toBe(true);
  });

  it('should return false when date is not between two dates', () => {
    const date = new BirthDate(earlierDateStr);
    expect(date.isBetweenTheDates(validDateStr, laterDateStr)).toBe(false);
  });
});
