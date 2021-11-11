import { failure, Parser, State } from '../state'

export function error<T>(parser: Parser<T>, expected: string): Parser<T> {
  return {
    parse(state: State) {
      const result = parser.parse(state)

      switch (result.kind) {
        case 'success': {
          return result
        }

        case 'failure': {
          return failure(state, expected)
        }
      }
    }
  }
}
