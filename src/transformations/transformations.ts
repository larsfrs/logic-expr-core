import { ExpressionNode } from '../expressionTree/expressionTree.js';
import { binaryToNaryTree } from '../expressionTree/naryTree.js';
import { ExpressionTreeHistory  } from '../transformations/expressionTreeHistory.js';
import { deMorgan } from '../laws/deMorganLaw.js';
import { idempotencyLaw } from '../laws/idempotencyLaw.js'; 
import { combinedConstantLaws } from '../laws/constantLaws.js';
import { distributiveLaw } from '../laws/distributiveLaw.js';
import { expandNormalForm, isInExpandedForm } from '../transformations/expandedForms.js';


type TransformContext = {
    expressionNode: ExpressionNode;
    history: ExpressionTreeHistory;
};


/**
 * Negation Normal Form: 
 * 1. Negations are only allowed in front of variables
 * 2. Only NOT, AND and OR are allowed operations
 * This is the first step to get to CNF and DNF.
 * 
 * Plan:
 * 1. Transform the binary tree to an n-ary tree
 * 2. Strictly replace all operators that are not AND, OR or NOT with their corresponding structural equivalents
 * 3. Apply recursively:
 *   - DeMorgan's Law, and after each step: (simplification)
 *    - Idempotency Law
*     - Absorption Law
*     - Identity Law
*     - Complement Law
 */
export function toNNF(
    expressionNode: ExpressionNode,
    binary: boolean = true,
    HARD_LIMIT: number = 100,
): TransformContext {

    if (binary) expressionNode = binaryToNaryTree(expressionNode);

    const history = new ExpressionTreeHistory(expressionNode);

    // replace all operators that are not AND, OR or NOT with their corresponding structural equivalents
    // expressionNode = applyStructuralEquivalents(expressionNode);

    history.snapshot(expressionNode);

    for (let i = 0; i < HARD_LIMIT; i++) {
        expressionNode = deMorgan(expressionNode);
        expressionNode = idempotencyLaw(expressionNode);
        expressionNode = combinedConstantLaws(expressionNode);

        if (!history.hasChanged(expressionNode)) break;
        history.snapshot(expressionNode);

        if (i === HARD_LIMIT - 1) {
            throw new Error(`HARD_LIMIT reached in toNNF, expressionNode: ${expressionNode}`);
        }
    }

    return { expressionNode, history };
}


/**
 * Disjunctive Normal Form: 
 * 1. NNF conditions fullfilled
 * 2. Consists of a disjunction of one or more conjunctions, where
 *    each conjunction consists of one or more literals which might be negated.
 */
export function toDNF(
    expressionNode: ExpressionNode,
    HARD_LIMIT: number = 100
) : TransformContext {

    var { expressionNode, history } = toNNF(expressionNode, false, HARD_LIMIT);

    for (let i = 0; i < HARD_LIMIT; i++) {
        expressionNode = distributiveLaw(expressionNode);
        expressionNode = idempotencyLaw(expressionNode);
        expressionNode = combinedConstantLaws(expressionNode);

        if (!history.hasChanged(expressionNode)) break;
        history.snapshot(expressionNode);

        if (i === HARD_LIMIT - 1) {
            throw new Error(`HARD_LIMIT reached in toDNF, expressionNode: ${expressionNode}`);
        }
    }

    return { expressionNode, history };
}


/**
 * Expanded Disjunctive Normal Form:
 * 1. Every conjunction contains each literal occuring in the originial expression,
 *    with or without a negation.
 */
export function toExpandedDNF(
    expressionNode: ExpressionNode,
    HARD_LIMIT: number = 10
) : TransformContext {

    var { expressionNode, history } = toDNF(expressionNode);

    expressionNode = expandNormalForm(expressionNode);

    for (let i = 0; i < HARD_LIMIT; i++) {
        expressionNode = distributiveLaw(expressionNode);
        expressionNode = idempotencyLaw(expressionNode);
        expressionNode = combinedConstantLaws(expressionNode);

        history.snapshot(expressionNode);
        // snapshot before break, as isInExpandedForm checks if transformation
        // is finished and not if it didn't change
        if (isInExpandedForm(expressionNode)) break;

        if (i === HARD_LIMIT - 1) {
            throw new Error(`HARD_LIMIT reached in toExpandedDNF, expressionNode: ${expressionNode}`);
        }
    }

    return { expressionNode, history };
}


 /**
 * TODO: Conjunctive Normal Form
 */
export function toCNF() {}


/**
 * TODO: Expanded Conjunctive Normal Form
 */
export function toExpandedCNF() {}


/**
 * TODO: Algebraic Normal Form
 */
export function toANF() {}