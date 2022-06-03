import { sequence } from '../../combinators/sequence'
import { eol } from '../../parsers/eol'
import { letters } from '../../parsers/letter'
import { run, result, should, describe } from '../@helpers'

const tcase = `Hello\nWorld\n`
const tcaseLit = `Hello
World
`

describe('eol', (it) => {
  it('should succeed if given a newline (Unix)', () => {
    const actual = run(eol(), '\n')
    const expected = result(true, '\n')

    should.matchState(actual, expected)
  })

  it('should succeed if given a newline sequence (non-Unix)', () => {
    const actual = run(eol(), '\r\n')
    const expected = result(true, '\r\n')

    should.matchState(actual, expected)
  })

  it('should succeed if given a string with a newline at the end', () => {
    const parser = sequence(letters(), eol(), letters(), eol())

    const actualExplicit = run(parser, tcase)
    const actualImplicit = run(parser, tcaseLit)

    const expected = result(true, ['Hello', '\n', 'World', '\n'])

    should.matchState(actualExplicit, expected)
    should.matchState(actualImplicit, expected)
  })

  it('should fail if given a string without a newline', () => {
    const actual = run(sequence(letters(), eol()), 'Hello')
    const expected = result(false, 'end of line')

    should.matchState(actual, expected)
  })
})
