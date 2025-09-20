import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { associativityLawChildren } from "../laws/associativityLaw.js";
import { NaryOperatorNode, treeCanonicalForm } from "../expressionTree/naryTree.js";
import { ExpressionTreeHistory } from "../transformations/expressionTreeHistory.js";


/**
 * Top down recursive application of the absorption law on a given expression tree.
 * Uses the n-ary operator node.
 *
 * 1. A + AB = A
 * 2. A(A + B) = A (same as 1., with the roles of the operators + and * reversed)
 */
export function absorptionLaw(
    expressionNode: ExpressionNode,
    absorptionOperator: string = "+",
    absorptionWithOperator: string = "*",
    history?: ExpressionTreeHistory
): ExpressionNode {

    if (expressionNode instanceof LeafNode) return expressionNode;

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = absorptionLaw(
            expressionNode.left,
            absorptionOperator,
            absorptionWithOperator,
            history
        );
        return expressionNode;
    }

    if (expressionNode instanceof NaryOperatorNode) {
        if (expressionNode.operator === absorptionOperator) {
            const childCanonicalForms = expressionNode.children.map(treeCanonicalForm);
            const newChildren = expressionNode.children.filter((child, index) => {
                if (!(child instanceof NaryOperatorNode &&
                    child.operator === absorptionWithOperator)) {
                    return true;
                }

                const currentChildCF = childCanonicalForms[index];

                for (let i = 0; i < expressionNode.children.length; i++) {
                    const loopChildCF = childCanonicalForms[i];
                    if (i !== index &&
                        currentChildCF.includes(loopChildCF)) {
                            if (history) {
                                expressionNode.children[index].mark =
                                { marked: true, type: 'Absorption Law', colorGroup: "lightsteelblue" };
                            }
                        return false;
                    }
                }
                return true;
            });

            if (history && newChildren.length < expressionNode.children.length) {
                history.snapshot(expressionNode);
            }

            if (newChildren.length === 1) {
                if (history && expressionNode.root) {
                    newChildren[0].root = true;
                }
                return newChildren[0];
                
            } else {
                // only already modify the children, if its important
                // for the history mark capturing
                if (history) expressionNode.children = newChildren;
                expressionNode.children = associativityLawChildren(
                    newChildren.map(child =>
                        absorptionLaw(
                            child,
                            absorptionOperator,
                            absorptionWithOperator,
                            history
                        )
                    ),
                    expressionNode.operator
                );
                return expressionNode;
            }
            
        } else {
            expressionNode.children = associativityLawChildren(
                expressionNode.children.map(child =>
                    absorptionLaw(
                        child,
                        absorptionOperator,
                        absorptionWithOperator,
                        history
                    )
                ),
                expressionNode.operator
            );
            return expressionNode;
        }
    }
}