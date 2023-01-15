import { regexp } from '@parsers'
import { describe, result, run, should, it } from '@testing'

describe('regexp', () => {
  it('should succeed if given matching input', () => {
    const actualDigit = run(regexp(/\d/g, 'digit'), '0')
    const expectedDigit = result(true, '0')

    const actualDigits = run(regexp(/\d+/g, 'digits'), '9000')
    const expectedDigits = result(true, '9000')

    const actualMatchGroups = run(regexp(/\((\s)+\)/g, 'match-groups'), '( )')
    const expectedMatchGroups = result(true, '( )')

    should.matchState(actualDigit, expectedDigit)
    should.matchState(actualDigits, expectedDigits)
    should.matchState(actualMatchGroups, expectedMatchGroups)
  })

  it('should succeed if given matching input without Global flag', () => {
    const actualDigit = run(regexp(/\d/, 'digit'), '0')
    const expectedDigit = result(true, '0')

    const actualDigits = run(regexp(/\d+/, 'digits'), '9000')
    const expectedDigits = result(true, '9000')

    const actualMatchGroups = run(regexp(/\((\s)+\)/, 'match-groups'), '( )')
    const expectedMatchGroups = result(true, '( )')

    should.matchState(actualDigit, expectedDigit)
    should.matchState(actualDigits, expectedDigits)
    should.matchState(actualMatchGroups, expectedMatchGroups)
  })

  it('should succeed if matches the beginning of input', () => {
    const actualDigits = run(regexp(/\d{2,3}/g, 'first-digits'), '90000')
    const expectedDigits = result(true, '900')

    should.matchState(actualDigits, expectedDigits)
  })

  it('should succeed if matches the beginning of input without Global flag', () => {
    const actualDigits = run(regexp(/\d{2,3}/, 'first-digits'), '90000')
    const expectedDigits = result(true, '900')

    should.matchState(actualDigits, expectedDigits)
  })

  it('should succeed if given a RegExp with Unicode flag', () => {
    const actualReEmoji = run(regexp(/\w+\s+👌/gu, 'words, spaces, ok emoji'), 'Yes 👌')
    const expectedReEmoji = result(true, 'Yes 👌')

    should.matchState(actualReEmoji, expectedReEmoji)
  })

  it('should succeed if given a RegExp with Unicode flag and without Global one', () => {
    const actualReEmoji = run(regexp(/\w+\s+👌/u, 'words, spaces, ok emoji'), 'Yes 👌')
    const expectedReEmoji = result(true, 'Yes 👌')

    should.matchState(actualReEmoji, expectedReEmoji)
  })

  it('should succeed if given a RegExp with Unicode property escapes', () => {
    const actualReEmoji = run(regexp(/\p{Emoji_Presentation}+/gu, 'emoji'), '👌👌👌')
    const expectedReEmoji = result(true, '👌👌👌')

    const actualReNonLatin = run(regexp(/\P{Script_Extensions=Latin}+/gu, 'non-latin'), '大阪')
    const expectedReNonLatin = result(true, '大阪')

    should.matchState(actualReEmoji, expectedReEmoji)
    should.matchState(actualReNonLatin, expectedReNonLatin)
  })

  it('should succeed if given a RegExp with Unicode property escapes without Global flag', () => {
    const actualReEmoji = run(regexp(/\p{Emoji_Presentation}+/u, 'emoji'), '👌👌👌')
    const expectedReEmoji = result(true, '👌👌👌')

    const actualReNonLatin = run(regexp(/\P{Script_Extensions=Latin}+/u, 'non-latin'), '大阪')
    const expectedReNonLatin = result(true, '大阪')

    should.matchState(actualReEmoji, expectedReEmoji)
    should.matchState(actualReNonLatin, expectedReNonLatin)
  })

  it('should fail if does not match input', () => {
    const actualDigitFailure = run(regexp(/\d/g, 'digit'), 'hello')
    const expectedDigitFailure = result(false, 'digit')

    const actualEitherFailure = run(regexp(/(spec|test)/g, 'either'), 'spock')
    const expectedEitherFailure = result(false, 'either')

    should.matchState(actualDigitFailure, expectedDigitFailure)
    should.matchState(actualEitherFailure, expectedEitherFailure)
  })

  it(`should fail if given zero input and regexp with 'one or more' quantifier`, () => {
    const actualZeroFailure = run(regexp(/\d+/g, 'digits+'), '')
    const expectedZeroFailure = result(false, 'digits+')

    should.matchState(actualZeroFailure, expectedZeroFailure)
  })

  it(`should succeed if given zero input and regexp with 'zero or more' quantifier`, () => {
    const actualZeroSuccess = run(regexp(/\d*/g, 'digits*'), '')
    const expectedZeroSuccess = result(true, '')

    should.matchState(actualZeroSuccess, expectedZeroSuccess)
  })
})
