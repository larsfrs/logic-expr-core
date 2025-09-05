import { describe } from 'node:test';
import { LeafNode, UnaryOperatorNode } from '../../src/expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';


export const inputData = [
        {
            description: "A(AB)'CC", // A(A'+B')C (nnf) -> AB'C (dnf) (expanded dnf)
            input:  new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new UnaryOperatorNode(
                        new NaryOperatorNode(
                            [
                                new LeafNode('A'),
                                new LeafNode('B'),
                            ],
                            '*'),
                        "!"),
                    new LeafNode('C'),
                    new LeafNode('C'),
                ],
                '*'),
            nnf: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), "!"),
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                        ],
                        '+'),
                    new LeafNode('C'),
                ],
                '*'),
            dnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                            new LeafNode('C'),
                        ],
                        '*'),
                ],
                '+'),
            expandedDnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                            new LeafNode('C'),
                        ],
                        '*'),
                ],
                '+'),
        },
        {
            description: "A'B+B'C(A+C)", // A'B+B'C(A+C) (nnf) -> A'B+AB'C+B'C (dnf)
            // -> A'B(C+C') + AB'C + B'C(A+A') -> A'BC + A'BC' + AB'C + AB'C + A'B'C
            // -> A'BC + A'BC' + AB'C + A'B'C (dnf expanded)
            input: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), "!"),
                            new LeafNode('B'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                            new LeafNode('C'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('A'),
                                    new LeafNode('C'),
                                ],
                                '+'),
                        ],
                        '*'),
                ],
                '+'),
            nnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), "!"),
                            new LeafNode('B'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                            new LeafNode('C'),
                            new NaryOperatorNode(
                                [
                                    new LeafNode('A'),
                                    new LeafNode('C'),
                                ],
                                '+'),
                        ],
                        '*'),
                ],
                '+'),
            dnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), "!"),
                            new LeafNode('B')
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                            new LeafNode('C')
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                            new LeafNode('C')
                        ],
                        '*'),
                ], 
                '+'),
            expandedDnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), "!"),
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), "!"),
                            new LeafNode('B'),
                            new UnaryOperatorNode(new LeafNode('C'), "!"),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                            new LeafNode('C'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), "!"),
                            new UnaryOperatorNode(new LeafNode('B'), "!"),
                            new LeafNode('C'),
                        ],
                        '*'),
                ],
                '+')
        },
        {
            description: "(A+B)(B+C)(A+C)", // (A+B)(B+C)(A+C) (nnf) -> AB + AC + BC + ABC (dnf)
            input: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                        ],
                        '+'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                        '+'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('C'),
                        ],
                        '+'),
                ],
                '*'),
            nnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                        ],
                        '+'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                        '+'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('C'),
                        ],
                        '+'),
                ],
                '*'),
            dnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('C'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                        '*'),
                ],
                '+'),
            expandedDnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), '!'),
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('B'), '!'),
                            new LeafNode('C'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                            new UnaryOperatorNode(new LeafNode('C'), '!'),
                        ],
                        '*'),
                ],
                '+'),
        },
        {
            description: 'A+BC(!A+C)', // A+BC!A+BCC => A+!ABC+BC (dnf) => A(B+!B)(C+!C)+!ABC+BC(A+!A)
            // => ABC+AB!C+A!BC+A!B!C+!ABC
            input: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C'),
                            new NaryOperatorNode(
                                [
                                    new UnaryOperatorNode(new LeafNode('A'), '!'),
                                    new LeafNode('C'),
                                ],
                                '+'),
                        ],
                        '*'),
                ],
            '+'),
            nnf: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C'),
                            new NaryOperatorNode(
                                [
                                    new UnaryOperatorNode(new LeafNode('A'), '!'),
                                    new LeafNode('C'),
                                ],
                                '+'),
                        ],
                        '*'),
                ],
            '+'),
            dnf: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), '!'),
                            new LeafNode('C'),
                            new LeafNode('B'),
                        ],
                    '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                    '*'),
                ],
            '+'),
            expandedDnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('C'),
                            new LeafNode('B'),
                        ],
                    '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('B'),
                            new UnaryOperatorNode(new LeafNode('C'), '!'),
                        ],
                    '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('B'), '!'),
                            new LeafNode('C'),
                        ],
                    '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('B'), '!'),
                            new UnaryOperatorNode(new LeafNode('C'), '!'),
                        ],
                    '*'),
                    new NaryOperatorNode(
                        [
                            new UnaryOperatorNode(new LeafNode('A'), '!'),
                            new LeafNode('B'),
                            new LeafNode('C'),
                        ],
                    '*'),
                ],
            '+'),
        }
    ];