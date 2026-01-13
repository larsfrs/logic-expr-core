import { ExpressionNode } from '../expressionTree/expressionTree.js';
import { binaryToNaryTree } from '../expressionTree/naryTree.js';
import { ExpressionTreeHistory  } from '../transformations/expressionTreeHistory.js';
import { deMorgan } from '../laws/deMorganLaw.js';
import { idempotencyLaw } from '../laws/idempotencyLaw.js'; 
import { combinedConstantLaws } from '../laws/constantLaws.js';
import { distributiveLaw } from '../laws/distributiveLaw.js';
import { expandNormalForm, getVariablesFromTree, isInExpandedForm } from '../transformations/expandedForms.js';
import { doubleNegationLaw } from '../laws/doubleNegationLaw.js';
import { absorptionLaw } from '../laws/absorptionLaw.js';


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

    let lastVersion: ExpressionNode = expressionNode;

    for (let i = 0; i < HARD_LIMIT; i++) {
        /**
         * Only on the first iteration, the double negation law is applied top-down,
         * as afterwards, only new negations in front of variables can appear,
         * which are handled by doubleNegationLawOnce inside the law
         * transformation functions.
         */
        if (i === 0) {
            expressionNode = doubleNegationLaw(expressionNode, history);
            // ToDo: flatten tree if needed
        }
        expressionNode = deMorgan(expressionNode, "!", "*", "+", history);
        expressionNode = idempotencyLaw(expressionNode, history);
        expressionNode = combinedConstantLaws(expressionNode, history);
        expressionNode = absorptionLaw(expressionNode, "*", "+", history);
        expressionNode = absorptionLaw(expressionNode, "+", "*", history);

        if (!history.hasChanged(lastVersion, expressionNode)) break;
        lastVersion = expressionNode;

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
    expressionNodeArg: ExpressionNode,
    HARD_LIMIT: number = 100
) : TransformContext {

    let { expressionNode, history } = toNNF(expressionNodeArg, false, HARD_LIMIT);

    let lastVersion: ExpressionNode = expressionNode;

    for (let i = 0; i < HARD_LIMIT; i++) {
        expressionNode = distributiveLaw(expressionNode, "*", "+", history);
        expressionNode = idempotencyLaw(expressionNode, history);
        expressionNode = combinedConstantLaws(expressionNode, history);
        expressionNode = absorptionLaw(expressionNode, "*", "+", history);
        expressionNode = absorptionLaw(expressionNode, "+", "*", history);

        if (!history.hasChanged(lastVersion, expressionNode)) break;
        lastVersion = expressionNode;

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
 * 
 * Notes:
 * - Absorption law is not applied here, as it would defeat the purpose of expanding the DNF.
 */
export function toExpandedDNF(
    expressionNodeArg: ExpressionNode,
    variables: Set<string> = getVariablesFromTree(expressionNodeArg),
    HARD_LIMIT: number = 10
) : TransformContext {

    let { expressionNode, history } = toDNF(expressionNodeArg);

    expressionNode = expandNormalForm(expressionNode, variables);

    for (let i = 0; i < HARD_LIMIT; i++) {
        expressionNode = distributiveLaw(expressionNode, "*", "+", history);
        expressionNode = idempotencyLaw(expressionNode, history);
        expressionNode = combinedConstantLaws(expressionNode, history);

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