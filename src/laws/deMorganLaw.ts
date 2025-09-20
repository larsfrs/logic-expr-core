import { ExpressionTreeHistory } from "src/transformations/expressionTreeHistory.js";
import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { NaryOperatorNode } from "../expressionTree/naryTree.js";
import { associativityLaw } from "../laws/associativityLaw.js";
import { updateParentChildren } from "../laws/recursionTools.js";
import { doubleNegationLawOnce } from "../laws/doubleNegationLaw.js";


/**
 * Top-down recursive application of the deMorgan law on a given expression tree.
 * Uses the n-ary operator node.
 * 
 * 1. !(A * B * C) = !A + !B + !C
 * 2. !(A + B + C) = !A * !B * !C (same as 1, with roles of operators reversed)
 */
export function deMorgan(
    expressionNode: ExpressionNode,
    deMorganOverOperator: string = "!",
    andOperator: string = "*",
    orOperator: string = "+",
    history?: ExpressionTreeHistory,
    /**
     * The following parameters are behind the history parameter,
     * as they are only meant to be used for the recursion, not for the initial call.
     */
    parent: ExpressionNode | null = null
): ExpressionNode {

    if (expressionNode instanceof LeafNode) return expressionNode;
    
    // unary operator found, its the negation operator
    if (expressionNode instanceof UnaryOperatorNode &&
        expressionNode.operator === deMorganOverOperator) {

        // is the child an n-ary operator with AND or OR operator?
        if (expressionNode.left instanceof NaryOperatorNode &&
            (expressionNode.left.operator === orOperator || expressionNode.left.operator === andOperator)) {

            const newOperator = (expressionNode.left.operator === orOperator) ? andOperator : orOperator;

            let newNode = new NaryOperatorNode(
                expressionNode.left.children.map(
                    child => new UnaryOperatorNode(child, deMorganOverOperator)
                ),
                newOperator
            );

            if (history) {
                /**
                 * The root property is not explicitly set to true here. Instead, we ensure
                 * it mirrors the root property of the top-level node. This approach allows
                 * the deMorgan function to be used flexibly, without being tightly coupled
                 * to history or root-specific properties.
                 */
                if (expressionNode.root) newNode.root = expressionNode.root;

                expressionNode.mark = { marked: true, type: 'DeMorgan\'s Law', colorGroup: 'lightsteelblue' };
                history.snapshot(newNode);

                /**
                 * Only when we care about the transformation history, it is important to directly update
                 * the root tree with new children. 
                 */
                updateParentChildren(newNode, parent, expressionNode);
            }

            /**
             * Apply double negation to the negated children.
             * We do this in a seperate step form the one above, as for the snapshot
             * the double negated child has to be set as a child first, so the
             * snapshot works correctly
             */
            newNode.children = newNode.children.map(
                child => doubleNegationLawOnce(child, history)
            );

            return deMorgan(
                newNode,
                deMorganOverOperator,
                andOperator,
                orOperator,
                history,
                expressionNode
            );

        } else {

            // just continue recursion
            expressionNode.left = deMorgan(
                expressionNode.left,
                deMorganOverOperator,
                andOperator,
                orOperator,
                history,
                expressionNode
            );
            return expressionNode;
        }
    }

    // unary operator found, but not the negation operator
    // with boolean logic this case should not happen, as ! is the only unary operator
    if (expressionNode instanceof UnaryOperatorNode &&
        expressionNode.operator !== deMorganOverOperator) {

        // just continue recursion
        expressionNode.left = deMorgan(
            expressionNode.left,
            deMorganOverOperator,
            andOperator,
            orOperator,
            history,
            expressionNode
        );

        // here, tecvhnically a new node after recursion could be a unary node
        // with '!' operator, so we apply double negation
        return doubleNegationLawOnce(expressionNode, history);
    }
    
    // n-ary operator found
    if (expressionNode instanceof NaryOperatorNode) {

        // if we just encounter an NaryOperatorNode, we apply deMorgan recursively to all children
        expressionNode.children = expressionNode.children.map(child =>
            deMorgan(
                child,
                deMorganOverOperator,
                andOperator,
                orOperator,
                history,
                expressionNode
            )
        );
        
        // only here we check for associativity, as here we can compare if new children
        // have the same operator as the parent node of the n-ary node
        return associativityLaw(expressionNode);
    }
}