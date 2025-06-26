# Logical Expressions Core Module

[NPM Package Page](https://www.npmjs.com/package/logic-expr-core) | [Examples](docs/examples.md) | [Development Setup](docs/dev-setup.md)

## Description

A TypeScript module that parses, transforms, derives and evaluates logic expressions. Can be easily extended to support more operators, variables, notations, etc.

## Features

- parse string of expression to RPN (Reverse Polish Notation) `a*!(b|c) => a b c | ! *`
    - handle different notations like postfix and prefix, add/omit "and" operators, etc.
- parse RPN to a binary AST (Abstract Syntax Tree)
    ```
    BinaryOperatorNode (AND)
    ├── VariableNode (a)
    ├── UnaryOperatorNode (NOT)
    │   └── BinaryOperatorNode (OR)
    │       ├── VariableNode (b)
    │       └── VariableNode (c)
    ```
- evaluate binary AST to boolean value
    ```
    BinaryOperatorNode.evaluate(a=true, b=false, c=true) => false
    ```

## In development

- transform AST to CNF (Conjunctive Normal Form) and DNF (Disjunctive Normal Form)
    - specifically, show every step of the transformation and output a list of transformations
- equivalence checking (using truth tables, CNF and DNF, etc.)
- visualization of the expression tree and transformations (maybe)


## Installation

- install with npm:
```bash
npm install logic-expr-core
```

- use with a symlink, after setting up the [dev environment](/docs/dev-setup.md):
```bash
npm link # in the root of the repository
npm link logic-expr-core # in the project where you want to use it 
```