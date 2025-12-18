# Logical Expressions Core Module


![NPM License](https://img.shields.io/npm/l/logic-expr-core?color=%234C1)
![NPM Version](https://img.shields.io/npm/v/logic-expr-core)
![NPM Downloads](https://img.shields.io/npm/dy/logic-expr-core)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/logic-expr-core)


## Description

A TypeScript module that parses, transforms, derives and evaluates logic expressions. Can be easily extended to support more operators, variables, notations, etc.

## Quick Examples

(Test more examples using the demo, see [demo/README.md](demo/README.md))

#### Transform `a'(ab'+c)'` to it's expanded DNF using boolean algebra:
<div align="center">
    <img src="./assets/example_transform.png" width="400" />
</div>

## Installation

- install from repository:
```bash
git clone https://github.com/larsfrs/logic-expr-core.git
cd logic-expr-core
npm install
npm run build
```
- then you can use it in your project by either:
    - creating a symlink with `npm link` (good for development)
    - importing it directly from the `dist` folder (or copy the contents of the `dist` folder to your project)

- install with npm:
```bash
npm install logic-expr-core
```

## Features

- parse string of expression to RPN (Reverse Polish Notation)
    - `a*!(b|c) => a b c | ! *`
    - handle different notations like postfix and prefix, add/omit "and" operators, etc.

- parse RPN to a binary AST (Abstract Syntax Tree)
    ```
    BinaryOperatorNode (AND)
    ├── LeafNode (a)
    ├── UnaryOperatorNode (NOT)
    │   └── BinaryOperatorNode (OR)
    │       ├── LeafNode (b)
    │       └── LeafNode (c)
    ```

- evaluate binary AST to boolean value
    ```typescript
    const result: boolean = evaluateExpression("a!(b+c)", { a: true, b: false, c: true }, booleanContext);
    console.log(result); // false
    ```

- turn binary AST to n-ary AST (more than 2 children per node)
    ```
    BinaryOperatorNode (AND)
    ├── LeafNode (a)
    ├── BinaryOperatorNode (AND)
    │   ├── LeafNode (b)
    │   └── LeafNode (c)
    ```
    - turns into n-ary AST: (and back)    
    ```
    NaryOperatorNode (AND)
    ├── LeafNode (a)
    ├── LeafNode (b)
    └── LeafNode (c)
    ```

- apply transformative laws to the AST
    - e.g. distributive law, absorption law, de Morgan's law, etc.

- transform the AST to different normal forms (NNF, DNF)
    - show every step of the transformation and output a list of transformations
    
- visualization of the expression tree and transformations

## In development
- equivalence checking (using truth tables, CNF and DNF, etc.)

## Goal
- create a module for visualizing transformations of expressions in boolean algebra
- show through the code how to implement a parser, AST, evaluator, etc. in TypeScript
- make it easy to extend and customize for different use cases
- keep it small and simple, without unnecessary dependencies

## Keywords
logic, boolean algebra, expressions, parser, AST, abstract syntax tree, RPN, reverse polish notation, evaluator, normal forms, DNF, CNF, NNF, TypeScript