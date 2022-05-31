import { choice } from '../combinators/choice'
import { error } from '../combinators/error'
import { type Parser } from '../state'

import { string } from './string'

const EOL_UNIX = '\n'
const EOL_NON_UNIX = '\r\n'

export function eol(): Parser<string> {
  return error(choice(string(EOL_UNIX), string(EOL_NON_UNIX)), 'end of line')
}
