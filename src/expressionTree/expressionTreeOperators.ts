/**
 * This defines the operators there are, the symbols they might use, and how they behave.
 * Everything is kept as generic as possible, so that it can be used for different types of operators easily.
 * For example the evaluation can be a operators as a string with any number of arguments of any type, and any return type.
 */
export type OperatorContext = {
    canonicalOperators: CanonicalOperators;
    operatorMetadata: Record<string, OperatorMetadata>;
    operatorEval:  Record<string, (...args: any[]) => any>;
}

/**
 * Since multiple symbols or names can represent the same operation, we define a set of "canonical operators".
 * See an example (BooleanCanonicalOps) for boolean algebra below.
 */
export type CanonicalOperators = Set<string>;

/**
 * Metadata for each individual operator, defining its type, precedence, associativity, notation and canonical form.
 */
export type OperatorMetadata = {
    type: 'unary' | 'binary';
    precedence: number;
    associativity: 'left' | 'right';
    notation: 'infix' | 'prefix' | 'postfix';
    canonical: string;
};

/* BOOLEAN Canonical Symbols, Operators and eval Functions */
const BooleanCanonicalOps: CanonicalOperators = new Set([ 'NOT', 'AND', 'OR', 'XOR', 'NAND', 'NOR', 'IMPLIES', 'BICONDITIONAL' ]);

const allBooleanOperators: Record<string, OperatorMetadata> = {
    '!': { type: 'unary', precedence: 4, associativity: 'right', notation: 'prefix', canonical: 'NOT' },
    '~': { type: 'unary', precedence: 4, associativity: 'right', notation: 'prefix', canonical: 'NOT' },
    "'": { type: 'unary', precedence: 4, associativity: 'right', notation: 'postfix', canonical: 'NOT' },
    '&': { type: 'binary', precedence: 3, associativity: 'left', notation: 'infix', canonical: 'AND' },
    '*': { type: 'binary', precedence: 3, associativity: 'left', notation: 'infix', canonical: 'AND' },
    '|': { type: 'binary', precedence: 2, associativity: 'left', notation: 'infix', canonical: 'OR' },
    '+': { type: 'binary', precedence: 2, associativity: 'left', notation: 'infix', canonical: 'OR' }
}

// only defined for prefix and infix notation, as postfix operators will be converted to prefix notation
export const operatorEvalBoolean: Record<string, (a: boolean, b?: boolean) => boolean> = {
    '&': (a, b = false) => a && b,
    '*': (a, b = false) => a && b,
    '|': (a, b = false) => a || b,
    '+': (a, b = false) => a || b,
    '!': (a) => !a,
    '~': (a) => !a,
    '⊕': (a, b) => (!a&&b)||(a&&!b),
    '⇒': (a, b) => !a || b,
    '⊼': (a, b) => !(a && b),
    '⊽': (a, b) => !(a || b),
    '⇔': (a, b) => (a && b) || (!a && !b),
};

export const booleanContext: OperatorContext = {
    canonicalOperators: BooleanCanonicalOps,
    operatorMetadata: allBooleanOperators,
    operatorEval: operatorEvalBoolean
};

/* MATH Canonical Symbols, Operators and eval Functions */

const MathCanonicalOps: CanonicalOperators = new Set([ 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MODULO' ]);

const allMathOperators: Record<string, OperatorMetadata> = {
    '*': { type: 'binary', precedence: 3, associativity: 'left', notation: 'infix', canonical: 'MULTIPLY' },
    '+': { type: 'binary', precedence: 2, associativity: 'left', notation: 'infix', canonical: 'ADD' },
    '-': { type: 'binary', precedence: 2, associativity: 'left', notation: 'infix', canonical: 'SUBTRACT' },
    '/': { type: 'binary', precedence: 3, associativity: 'left', notation: 'infix', canonical: 'DIVIDE' },
    '%': { type: 'binary', precedence: 3, associativity: 'left', notation: 'infix', canonical: 'MODULO' },
    '^': { type: 'binary', precedence: 4, associativity: 'right', notation: 'infix', canonical: 'POWER' }
};

const operatorEvalMath: Record<string, (a: number, b: number) => number> = {
    '*': (a, b) => a * b,
    '+': (a, b) => a + b, 
    '-': (a, b) => a - b,
    '/': (a, b) => a / b,
    '%': (a, b) => a % b,
    '^': (a, b) => Math.pow(a, b)
};

export const mathContext: OperatorContext = {
    canonicalOperators: MathCanonicalOps,
    operatorMetadata: allMathOperators,
    operatorEval: operatorEvalMath
};