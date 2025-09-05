import { identityLaw } from "../laws/identityLaw.js";
import { dominantLaw } from "../laws/dominantLaw.js";
import { complementLaw } from "../laws/complementLaw.js";
import { ExpressionNode, LeafNode } from "../expressionTree/expressionTree.js";

/**
 * id & comp & dom laws combined
 * 
 * The idea here is to handle all laws that either create 1s or 0s, or remove them,
 * in one go.
 * TODO: combine some of the laws, to avoid multiple passes over the tree.
 */
export function combinedConstantLaws(
    expressionNode: ExpressionNode
) { 
    // 1. apply complement law to create 1s and 0s
    expressionNode = complementLaw(expressionNode, '+', '!', new LeafNode('1'));
    expressionNode = complementLaw(expressionNode, '*', '!', new LeafNode('0'));

    // 2. apply dominant law to get rid of subtrees
    expressionNode = dominantLaw(expressionNode, '+', new LeafNode('1'));
    expressionNode = dominantLaw(expressionNode, '*', new LeafNode('0'));

    // 3. apply identity law to remove 1s and 0s again
    expressionNode = identityLaw(expressionNode, '*', new LeafNode('1'));
    expressionNode = identityLaw(expressionNode, '+', new LeafNode('0'));

    return expressionNode;
}