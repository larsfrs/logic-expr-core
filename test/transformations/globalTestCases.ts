import { LeafNode, UnaryOperatorNode } from '../../src/expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../../src/expressionTree/naryTree.js';


export const inputData = [
        {
            description: "A(AB)'CC", // A(A'+B')C (nnf) -> AB'C (dnf) (expanded dnf)
            variables: new Set<string>(['A', 'B', 'C']),
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
            /**
             * Starting: A'B + B'C(A+C)  <- toNNF finds absorption case for B'C(A+C)
             * NNF:      A'B + B'C
             * DNF:      A'B + B'C
             * E.DNF:    A'B(C+C') + B'C(A+A') = A'BC + A'BC' + AB'C + A'B'C
             * KNF:      
             * E.KNF:    
             */
            description: "A'B+B'C(A+C)",
            variables: new Set<string>(['A', 'B', 'C']),
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
                        ],
                        '*'),
                ],
                '+'),
            dnf: new NaryOperatorNode(
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
            /**
             * Starting: (A+B)(B+C)(A+C)
             * NNF:      (A+B)(B+C)(A+C)
             * DNF:      AB + AC + BC + ABC = AB + AC + BC (absorption)
             * E.DNF:    AB(C+C') + AC(B+B') + BC(A+A') = ABC + ABC' + ABC + AB'C + ABC + A'BC = AB'C + A'BC + ABC' + ABC
             * KNF:      
             * E.KNF:
             */
            description: "(A+B)(B+C)(A+C)",
            variables: new Set<string>(['A', 'B', 'C']),
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
            /**
             * Starting: A+BC(!A+C) <- absorption handles C(!A+C) = C
             * NNF:      A + BC
             * DNF:      A + BC
             * E.DNF:    A(B+!B)(C+!C) + BC(A+!A) = ABC + A!BC + AB!C + A!B!C + BCA + BC!A
             * KNF:
             * E.KNF:
             */
            description: 'A+BC(!A+C)',
            variables: new Set<string>(['A', 'B', 'C']),
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
                        ],
                        '*'),
                ],
            '+'),
            dnf: new NaryOperatorNode(
                [
                    new LeafNode('A'),
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
        },
        {
            /**
             * Starting: A+!!(A*C) <- toNNF removes double negation, and applies absorption A+AC = A
             * NNF:      A
             * DNF:      A
             * E.DNF:    A(C+C') = AC + AC'
             * KNF:
             * E.KNF:
             */
            description: "A+!!(A*C)", // a+(ac)'',
            variables: new Set<string>(['A', 'C']),
            input: new NaryOperatorNode(
                [
                    new LeafNode('A'),
                    new UnaryOperatorNode(
                        new UnaryOperatorNode(
                            new NaryOperatorNode(
                                [
                                    new LeafNode('A'),
                                    new LeafNode('C'),
                                ],
                                '*'),
                            '!'),
                        '!'),
                ],
                '+'),
            nnf: new LeafNode('A'),
            dnf: new LeafNode('A'),
            expandedDnf: new NaryOperatorNode(
                [
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new LeafNode('C'),
                        ],
                        '*'),
                    new NaryOperatorNode(
                        [
                            new LeafNode('A'),
                            new UnaryOperatorNode(new LeafNode('C'), '!'),
                        ],
                        '*'),
                ],
                '+'),
        }
    ];