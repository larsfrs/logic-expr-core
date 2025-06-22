import { BinaryOperatorNode, LeafNode, UnaryOperatorNode, ExpressionNode } from '../../src/expressionTree/expressionTree.js';

export const globalUnsanitizedInput: string[] = [
    'aaa(b+c)',
    "(ab)'+c+d",
    'a+(b+c)',
    "(ab)''",
    'a+!(b+!c)',
    "aaa'''"
]

// variables for the following tests are always ['a', 'b', 'c', 'd']
export const globalInput: string[] = [
    'a*a*a*(b+c)',  // this is interisting because of the triple multiplication
    '!(a*b)+c+d',   // here a unary operator before parenthesis is tested
    'a+(b+c)',      // here associativity is tested, the paraenthesis are needed here
    '!!(a*b)',      // here a double negation is tested
    'a+!(b+!c)',    // unary operator before parenthesis and a negation inside the parenthesis
    'a*a*!!!a'      // triple negation
]

export const globalInputRPN: string[][]=  [
    ['a', 'a', '*', 'a', '*', 'b', 'c', '+', '*'],
    ['a', 'b', '*', '!', 'c', '+', 'd', '+'],
    ['a', 'b', 'c', '+', '+'],
    ['a', 'b', '*', '!', '!'],
    ['a', 'b', 'c', '!', '+', '!', '+'],
    ['a', 'a', '*', 'a', '!', '!', '!', '*']
]

export const globalTrees: ExpressionNode[] = [
    new BinaryOperatorNode(
        new BinaryOperatorNode(
            new BinaryOperatorNode(
                new LeafNode('a'),
                new LeafNode('a'),
                '*'
            ),
            new LeafNode('a'),
            '*'
        ),
        new BinaryOperatorNode(
            new LeafNode('b'),
            new LeafNode('c'),
            '+'
        ),
        '*'
    ),
    new BinaryOperatorNode(
        new BinaryOperatorNode(
            new UnaryOperatorNode(
                new BinaryOperatorNode(
                    new LeafNode('a'),
                    new LeafNode('b'),
                    '*'
                ),
                '!'
            ),
            new LeafNode('c'),
            '+'
        ),
        new LeafNode('d'),
        '+'
    ),
    new BinaryOperatorNode(
        new LeafNode('a'),
        new BinaryOperatorNode(
            new LeafNode('b'),
            new LeafNode('c'),
            '+'
        ),
        '+'
    ),
    new UnaryOperatorNode(
        new UnaryOperatorNode(
            new BinaryOperatorNode(
                new LeafNode('a'),
                new LeafNode('b'),
                '*'
            ),
            '!'
        ),
        '!'
    ),
    new BinaryOperatorNode(
        new LeafNode('a'),
        new UnaryOperatorNode(
            new BinaryOperatorNode(
                new LeafNode('b'),
                new UnaryOperatorNode(
                    new LeafNode('c'),
                    '!'
                ),
                '+'
            ),
            '!'
        ),
        '+'
    ),
    new BinaryOperatorNode(
        new BinaryOperatorNode(
            new LeafNode('a'),
            new LeafNode('a'),
            '*'
        ),
        new UnaryOperatorNode(
            new UnaryOperatorNode(
                new UnaryOperatorNode(new LeafNode('a'), '!'),
                '!'
            ),
            '!'
        ),
        '*'
    )
]