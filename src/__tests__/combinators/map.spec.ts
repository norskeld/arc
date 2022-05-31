import { suite } from 'uvu'

import { map, mapTo } from '../../combinators/map'
import { string } from '../../parsers/string'

import { result, run, should } from '../@helpers'

let it = suite('map')

it('should succeed if a single given parser succeeds', () => {
  const parser = map(string('9000'), (value) => parseInt(value, 10))
  const actual = run(parser, '9000')
  const expected = result(true, 9000)

  should.matchState(actual, expected)
})

it('should fail if a single given parser fails', () => {
  const parser = map(string('9000'), (value) => parseInt(value, 10))
  const actual = run(parser, 'xxxx')
  const expected = result(false, '9000')

  should.matchState(actual, expected)
})

it.run()

it = suite('mapTo')

it('should succeed if a single given parser succeeds', () => {
  const parser = mapTo(string('9000'), 'constant')
  const actual = run(parser, '9000')
  const expected = result(true, 'constant')

  should.matchState(actual, expected)
})

it.run()
