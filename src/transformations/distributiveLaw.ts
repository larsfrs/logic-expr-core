import { booleanContext, OperatorContext } from "src/expressionTree/expressionTreeOperators.js";
import { ExpressionNode, BinaryOperatorNode, LeafNode } from "../expressionTree/expressionTree.js";

function isBinaryNode(node: ExpressionNode): node is BinaryOperatorNode {
    return node instanceof BinaryOperatorNode;
}

function isBinaryAndDistributable(node: ExpressionNode, op: string): node is BinaryOperatorNode {
    return node instanceof BinaryOperatorNode && node.operator == op;
}

/**
 * Recursive function that applies the distributive law on an Expression Tree.
 * 1. A(B + C) = AB + AC
 * 2. A + BC = (A + B)(A + C) (technically same as 1., with the roles of the operators reversed)
 */
export function distribute(
    expressionNode: ExpressionNode,
    distributeWithCanOp: string,
    distributeOverCanOp: string,
    operatorContext: OperatorContext = booleanContext
) : ExpressionNode {

    if (ExpressionNode instanceof LeafNode) {
        // if the node is a leaf, we cannot distribute anything
        return expressionNode;
    }

    // the most basic example where this applies would be A(B + C),
    // where we distribute the AND * over the OR +.
    // so distributeWithCanOp = "*" and distributeOverCanOp="+"

    if (isBinaryNode(expressionNode) &&
        expressionNode.operator == distributeWithCanOp)
    {   

        const current = isBinaryAndDistributable(expressionNode.left, distributeOverCanOp)
            ? expressionNode.left
            : isBinaryAndDistributable(expressionNode.right, distributeOverCanOp)
                ? expressionNode.right
                : null;

        if (current) {
            const { left: b, right: c } = current;
            const a = current === expressionNode.left
                ? expressionNode.right
                : expressionNode.left;

            const newRelativeRoot: ExpressionNode = 
                new BinaryOperatorNode(
                    distribute(
                        new BinaryOperatorNode(a, b, distributeWithCanOp), // AB
                        distributeWithCanOp,
                        distributeOverCanOp,
                        operatorContext
                    ),
                    distribute(
                        new BinaryOperatorNode(a, c, distributeWithCanOp), // AC
                        distributeWithCanOp,
                        distributeOverCanOp,
                        operatorContext
                    ),
                    distributeOverCanOp // AB + AC
                );

            // apply associativity, *after* distribution
            const finalRelativeRoot = applyAssociativity(newRelativeRoot, distributeOverCanOp);

            return finalRelativeRoot;

        } else {
            return expressionNode;
        }
    }

    return expressionNode;
}

/**
 * There are 2 cases, where after the distribution, we can apply associativity:
 * 1. the current node has a binary operator, and the node on the right with the same
 *    binary operator is left-associative (or vice-versa)
 * 2. the current node has a binary operator, and the node on the right & left have the same
 *    binary operator, and that operator is left-associative (or vice-versa)
 */
export function applyAssociativity(
    node: ExpressionNode,
    distributeOverCanOp: string
): ExpressionNode {
    let returnNode: ExpressionNode = null;

    if (node instanceof LeafNode) { return node; };
    const isBinary = isBinaryNode(node);
    if (!isBinary) { return node; }

    const l = node.left;
    const r = node.right;

    const isBinaryLeft = isBinaryNode(l);
    const isBinaryRight = isBinaryNode(r);
    const isBinaryAsLeft = isBinaryLeft && l.operator == distributeOverCanOp;
    const isBinaryAsRight = isBinaryRight && r.operator == distributeOverCanOp;

    // case 1: only the right has a left-associative operator
    if (node.operator == distributeOverCanOp && !isBinaryAsLeft && isBinaryAsRight) {
        returnNode = new BinaryOperatorNode(r, l, distributeOverCanOp);
    }

    // case 2: both right and left are left-associative, so rearange whole tree
    else if (node.operator == distributeOverCanOp && isBinaryAsLeft && isBinaryAsRight) {
    
        const c = r.left;
        const d = r.right;

        returnNode = new BinaryOperatorNode(
            new BinaryOperatorNode(l, c, distributeOverCanOp),
            d,
            distributeOverCanOp
        );
    }
    
    return returnNode || node; // if no case matched, return the original node
}