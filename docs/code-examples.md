# Examples

## 1. Evaluating a boolean expression

The `evaluateExpression()` function allows you to evaluate a boolean expression with given variable values.

```javascript
import { evaluateExpression, booleanContext } from 'logic-expr-core';

const result = evaluateExpression(
    "aba'(a|b'c)'",
    new Map([
        ["a", true],
        ["b", false],
        ["c", true]
    ]),
    booleanContext
)

console.log(result); // false
```
(esm module syntax)

The function recognizes the operators with the correspinding symbols:

- AND: '&' or '·' or '*'
- OR: '|' or '+'
- NOT: '!' or '~' or "'"

Note that some of these are postfix and some are prefix operators. This means that for example: `a!(b|c) == a(b|c)'`.

One of the arguments given to the main `evaluateExpression()` function is the `operatorContext`.
This holds the operators, their precedence, associativity etc.
Let's make OR evaluate before AND by changing their precedence:

```javascript
console.log(booleanContext.operatorMetadata["+"].precedence); // 2
console.log(booleanContext.operatorMetadata["*"].precedence); // 3

booleanContext.operatorMetadata["+"].precedence = 3;
booleanContext.operatorMetadata["*"].precedence = 2;
```

We can now check if this works with a simpler expression:

```javascript
const result2 = evaluateExpression(
    "ab+c",
    new Map([
        ["a", true],
        ["b", false],
        ["c", true]
    ]),
    booleanContext
)

console.log(result2); // true
```

If `ab+c` were evaluated in regular boolean algebra, it would result in a `false`.

You could add custom operators to the `operatorContext` as well, and define their precedence, associativity, notation, are they unary or binary, etc.
