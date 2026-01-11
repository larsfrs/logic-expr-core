export const markingTypes = [
    'Distributive Law',
    'Idempotency Law',
    'DeMorgan\'s Law',
    'Absorption Law',
    'Identity Law',
    'Complement Law',
    'Associativity Law',
    'Commutativity Law',
    'Double Negation Law',
    'Dominant Law',
] as const;

// katex color names
export const lightColorGroups = [
    'lightsteelblue',
    'palegreen',
    'thistle',
    'peachpuff',
    'gray',
    'steelblue',
    'green',
    'orchid',
    'darkorange',
    'dimgray'
] as const;

export const darkColorGroups = [
    'midnightblue',
    'seagreen',
    'indigo',
    'saddlebrown',
    'darkslategray',
    'royalblue',
    'darkgreen',
    'purple',
    'chocolate',
    'black'
] as const;


export const colorMapping: Record<typeof markingTypes[number], { light: typeof lightColorGroups[number], dark: typeof darkColorGroups[number] }> = {
    'Distributive Law': { light: 'lightsteelblue', dark: 'midnightblue' },
    'Idempotency Law': { light: 'palegreen', dark: 'seagreen' },
    'DeMorgan\'s Law': { light: 'thistle', dark: 'indigo' },
    'Absorption Law': { light: 'peachpuff', dark: 'saddlebrown' },
    'Identity Law': { light: 'gray', dark: 'darkslategray' },
    'Complement Law': { light: 'steelblue', dark: 'royalblue' },
    'Associativity Law': { light: 'green', dark: 'darkgreen' },
    'Commutativity Law': { light: 'orchid', dark: 'purple' },
    'Double Negation Law': { light: 'darkorange', dark: 'chocolate' },
    'Dominant Law': { light: 'dimgray', dark: 'black' },
};

/**
 * Markings are used to highlight parts of the expression tree
 * that have been modified by a transformation. They are purely for 
 * visualization purposes and not used in any logic operations.
 * A marking can be either unmarked, or marked with a type and colorGroup.
 */
export type Marking =
  | { 
        marked: false;
        type?: never;
        colorGroup?: never
    }
  | { 
        marked: true;
        type: typeof markingTypes[number];
    };

export const defaultMarking: Marking = { marked: false };

