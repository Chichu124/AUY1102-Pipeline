import { Seasons, SEASONS } from './__mocks__/Seasons';

describe('EnumValueObject', () => {
  describe('check value is valid', () => {
    it(`should return void if the value exists on SEASONS`, () => {
      const expected = new Seasons(SEASONS.SPRING);

      expect(expected).toBeInstanceOf(Seasons);
      expect(expected.value).toBe(SEASONS.SPRING);
    });

    it(`should throw an error if the value does not exist on SEASONS`, () => {
      const invalidSeason = 'INVALID_SEASON' as unknown as SEASONS;

      expect(() => new Seasons(invalidSeason)).toThrow(
        `the value: ${invalidSeason}, no exists on seasons`
      );
    });
  });
});
