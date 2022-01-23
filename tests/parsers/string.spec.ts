import { string, ustring } from '@lib/parsers/string'

import { run, result, should } from '@tests/@helpers'

describe(ustring, () => {
  it('should succeed if given an ASCII string', () => {
    const tcase = 'test'

    const actual = run(ustring(tcase), tcase)
    const expected = result('success', tcase)

    should.matchState(actual, expected)
  })

  it('should succeed if given a Unicode string', () => {
    ;['语言处理', 'Hëllø!', 'Family :: 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦'].forEach((tcase) => {
      const actual = run(ustring(tcase), tcase)
      const expected = result('success', tcase)

      should.matchState(actual, expected)
    })
  })

  it('should succeed if given a repetitive input', () => {
    const tcase = 'test'

    const actual = run(ustring(tcase), tcase.repeat(2))
    const expected = result('success', tcase)

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const tcase = 'test'

    const actual = run(ustring(tcase), 'wrong')
    const expected = result('failure', tcase)

    should.matchState(actual, expected)
  })

  it('should fail if given a zero-length input', () => {
    const tcase = 'test'

    const actual = run(ustring(tcase), '')
    const expected = result('failure', tcase)

    should.matchState(actual, expected)
  })
})

describe(string, () => {
  it('should succeed if given an ASCII string', () => {
    const tcase = 'test'

    const actual = run(string(tcase), tcase)
    const expected = result('success', tcase)

    should.matchState(actual, expected)
  })

  it('should succeed if given a repetitive input', () => {
    const tcase = 'test'

    const actual = run(string(tcase), tcase.repeat(2))
    const expected = result('success', tcase)

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const tcase = 'test'

    const actual = run(string(tcase), 'wrong')
    const expected = result('failure', tcase)

    should.matchState(actual, expected)
  })

  it('should fail if given a zero-length input', () => {
    const tcase = 'test'

    const actual = run(string(tcase), '')
    const expected = result('failure', tcase)

    should.matchState(actual, expected)
  })
})
