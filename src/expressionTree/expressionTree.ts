import { operatorEvalBoolean, booleanContext, OperatorMetadata } from "./expressionTreeOperators.js";

const allOperators = booleanContext.operatorMetadata;

export abstract class ExpressionNode {
    // args optional, so that we can get default values when we omit the args in the method call
    abstract toString(parentPrecendce?: number, isRightChild?: boolean): string;
    abstract evaluate(variables: Map<string, boolean>): boolean;
}

export class UnaryOperatorNode extends ExpressionNode {
    constructor(public left: ExpressionNode, public operator: string) {
        super();
    }

    evaluate(variables: Map<string, boolean>): boolean {
        return operatorEvalBoolean[this.operator](
            this.left.evaluate(variables)
        );
    }

    toString(parentPrecedence: number = 0, isRightChild: boolean = false): string {
        const precedence = allOperators[this.operator].precedence || 0;
        const childdString = this.left.toString(precedence, false);

        if (precedence < parentPrecedence) { // for example: !!a, not !(!a)
            return `(${this.operator}${childdString})`;
        }
        return `${this.operator}${childdString}`;

    }
}

export class BinaryOperatorNode extends ExpressionNode {
    constructor(public left: ExpressionNode, public right: ExpressionNode, public operator: string) {
        super();
    }
    evaluate(variables: Map<string, boolean>): boolean {
        return operatorEvalBoolean[this.operator](
            this.left.evaluate(variables),
            this.right.evaluate(variables)
        );
    }

    toString(parentPrecedence: number = 0, isRightChild: boolean = false): string {
        const precedence: number = allOperators[this.operator].precedence || 0;
        const associativity: string = allOperators[this.operator].associativity || 'left';

        const leftString: string = this.left.toString(precedence, false);
        const rightString: string = this.right.toString(precedence, true);

        const expression: string = `${leftString}${this.operator}${rightString}`;

        // examples for this: (spaces around the operator of the current node)
        // (a + b)+c => a+b+c as left associativity, no parentheses needed
        // a+(b + c) => a+(b+c) as left associativity, paraentheses needed
        const needsParentheses: boolean = (precedence < parentPrecedence) ||
            (precedence === parentPrecedence && associativity === 'left' && isRightChild) ||
            (precedence === parentPrecedence && associativity === 'right' && !isRightChild);

        return needsParentheses ? `(${expression})` : expression;
    }

}

export class LeafNode extends ExpressionNode {
    constructor(public value: string | boolean) {
        super();
    }

    evaluate(variables: Map<string, boolean>): boolean {
        if (typeof this.value === 'boolean') {
            return this.value;
        }
        return variables.get(this.value) ?? false; // default to false if variable not found
    }

    toString(parentPrecedence: number = 0, isRightChild: boolean = false): string {
        return this.value.toString();
    }
}