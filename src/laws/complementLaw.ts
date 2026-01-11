import { ExpressionTreeHistory } from "../transformations/expressionTreeHistory.js";
import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { NaryOperatorNode, treeCanonicalForm } from '../expressionTree/naryTree.js';


/**
 * Bottom-up recursive application of the complement law on an expression tree.
 * Uses the n-ary operator node.
 *
 * 1. A + !A = 1
 * 2. A * !A = 0
 */
export function complementLaw(
    expressionNode: ExpressionNode,
    operator: string = "+", // *
    complementOperator: string = "!", // "!"
    resultingNode: LeafNode = new LeafNode('1'), // new LeafNode('0')
    history?: ExpressionTreeHistory
): ExpressionNode {

    if (expressionNode instanceof LeafNode) {
        return expressionNode;
    }

    else if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = complementLaw(
            expressionNode.left,
            operator,
            complementOperator,
            resultingNode,
            history
        );
        return expressionNode;
    }

    else if (expressionNode instanceof NaryOperatorNode) {
        expressionNode.children = expressionNode.children.map(child =>
            complementLaw(
                child,
                operator,
                complementOperator,
                resultingNode,
                history
            )
        );

        if (expressionNode.operator === operator) {

            // build a hashmap of canonical forms to their indices
            const canonicalFormMap = new Map<string, number[][]>();
            expressionNode.children.forEach((child, index) => {

                let cf: string;
                cf = (child instanceof UnaryOperatorNode && child.operator === complementOperator)
                    ? treeCanonicalForm(child.left)
                    : treeCanonicalForm(child);

                if (!canonicalFormMap.has(cf)) {
                    canonicalFormMap.set(cf, [[], []]);
                }

                if (child instanceof UnaryOperatorNode && child.operator === complementOperator) {
                    canonicalFormMap.get(cf)![1].push(index); // unary
                } else {
                    canonicalFormMap.get(cf)![0].push(index); // non-unary
                }
            });

            // go through the map and check for pairs of unary and non-unary indices,
            // if found, replace first element of pair with resulting node, and second one with a placeholder to remove later
            // then later, remove all placeholders

            // TODO: this can use a loop to find more pairs that are the same, example:
            // A + !A + A + !A + B  => 1 + 1 + B  => 1 + B
            // currently, it only finds one pair per canonical form
            for (const [_, [nonUnaryIndices, unaryIndices]] of canonicalFormMap) {
                if (nonUnaryIndices.length > 0 && unaryIndices.length > 0) {

                    // replace first element of pair with resulting node, and second one with a placeholder to remove later
                    const [first, second] = [nonUnaryIndices[0], unaryIndices[0]].sort((a, b) => a - b);

                    if (history) {
                        expressionNode.children[first].mark =
                            { marked: true, type: 'Complement Law'};
                        expressionNode.children[second].mark =
                            { marked: true, type: 'Complement Law'};
                        history.snapshot(expressionNode);
                    }

                    expressionNode.children.splice(first, 1, resultingNode);
                    expressionNode.children.splice(second, 1, new LeafNode('placeholder'));
                }
            }
            
            // finally, remove all placeholders
            expressionNode.children = expressionNode.children.filter(child => !(child instanceof LeafNode && child.value === 'placeholder'));


            if (expressionNode.children.length === 1) {
                expressionNode.children[0].root = expressionNode.root;
                return expressionNode.children[0];
                // TODO: unhandled associativity case
            } else {
                // 0 as a case will not happen, because we only remove pairs of a and !a

                // TODO: here, we now directly apply one loop of id and dominant law,
                // to save more recursive calls later
            }
        }
    }

    return expressionNode;
}

