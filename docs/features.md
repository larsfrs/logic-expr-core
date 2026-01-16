## Features

- Parse string of expression to RPN (Reverse Polish Notation)
    - `a*!(b|c) => a b c | ! *`
    - handle different notations like postfix and prefix, add/omit "and" operators, etc.

- Parse RPN to a binary AST (Abstract Syntax Tree)
    ```
    BinaryOperatorNode (AND)
    ├── LeafNode (a)
    ├── UnaryOperatorNode (NOT)
    │   └── BinaryOperatorNode (OR)
    │       ├── LeafNode (b)
    │       └── LeafNode (c)
    ```

- Evaluate binary AST to boolean value
    ```typescript
    const result: boolean = evaluateExpression("a!(b+c)", { a: true, b: false, c: true }, booleanContext);
    console.log(result); // false
    ```

- Turn binary AST to n-ary AST (more than 2 children per node). For example:
    ```
    BinaryOperatorNode (AND)
    ├── LeafNode (a)
    ├── BinaryOperatorNode (AND)
    │   ├── LeafNode (b)
    │   └── LeafNode (c)

    ... turns into n-ary AST: (and back)   

    NaryOperatorNode (AND)
    ├── LeafNode (a)
    ├── LeafNode (b)
    └── LeafNode (c)
    ```

- Apply transformative laws to the AST
    - e.g. distributive law, absorption law, de Morgan's law, etc.

- Transform the AST to different normal forms (NNF, DNF)
    - Show every step of the transformation and output a list of transformations
    
- Visualization of the expression tree and transformations