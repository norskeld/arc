---
title: 'Parsers › ustring'
description: 'ustring parses a Unicode string. Returns the parsed string.'
---

# ustring

```typescript {{ withLineNumbers: false }}
function ustring(match: string): Parser<string>
```

## Description

> If you need to parse ASCII strings only, consider using [string] for better performance.

`ustring` parses a Unicode string. Returns the parsed string.

## Implementation notes

This parser is very similar to the [string] parser, except it takes a bit hacky (though performant) approach, that is based on counting length of the given `match` string *in bytes*. It then subslices and compares string slice with that `match` string.

It was tested on code points from the [Basic Multilingual Plane][bmp], but various tests showed that other planes are consumable as well, but that is not guaranteed. If you need guaranteed parsing of code points outside of the BMP, consider using [regexp] with `u` flag.

## Usage

```typescript
const Parser = ustring('语言处理')
```

<details>
  <summary>Output</summary>

  ### Success

  Note that the index is **12**, which is correct, since every hieroglyph here takes **3 bytes**.

  ```typescript {{ highlight: [5] }}
  run(Parser).with('语言处理')

  {
    kind: 'success',
    state: { text: '语言处理', index: 12 },
    value: '语言处理'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('语言')

  {
    kind: 'failure',
    state: { text: '语言', index: 0 },
    expected: '语言处理'
  }
  ```
</details>

<!-- Links. -->

[bmp]: https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane

<!-- Parsers. -->

[string]: ./string
[regexp]: ./regexp
