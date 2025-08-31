import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { associativityLawChildren } from "../laws/associativityLaw.js";
import { NaryOperatorNode, treeCanonicalForm } from "../expressionTree/naryTree.js";

/**
 * Bottom-up recursive application of the absorption law on a given expression tree.
 * Uses the n-ary operator node.
 *
 * 1. A + AB = A
 * 2. A(A + B) = A (same as 1., with the roles of the operators + and * reversed)
 */
export function absorptionLaw(
    expressionNode: ExpressionNode,
    absorptionOperator: string = "+",
    absorptionWithOperator: string = "*"
): ExpressionNode {

    if (expressionNode instanceof LeafNode) return expressionNode;

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = absorptionLaw(
            expressionNode.left,
            absorptionOperator,
            absorptionWithOperator
        );
        return expressionNode;
    }

    if (expressionNode instanceof NaryOperatorNode) {
        expressionNode.children = expressionNode.children.map(child =>
            absorptionLaw(child, absorptionOperator, absorptionWithOperator)
        );

        if (expressionNode.operator === absorptionOperator) {
            const childCanonicalForms = expressionNode.children.map(treeCanonicalForm);

            expressionNode.children = expressionNode.children.filter((child, index) => {
                if (child instanceof NaryOperatorNode &&
                    child.operator === absorptionWithOperator) {

                    const currentChildCF = childCanonicalForms[index];

                    for (let i = 0; i < expressionNode.children.length; i++) {
                        const loopChildCF = childCanonicalForms[i];
                        if (i !== index &&
                            currentChildCF.includes(loopChildCF)) {
                            return false;
                        }
                    }
                }
                return true;
            });

            if (expressionNode.children.length === 1) {
                return expressionNode.children[0];
            }
        }

        expressionNode.children = associativityLawChildren(expressionNode.children, expressionNode.operator);
    }

    return expressionNode;
}