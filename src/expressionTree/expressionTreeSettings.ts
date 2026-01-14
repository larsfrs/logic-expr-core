export type Settings = {
    latex: boolean;
    darkMode: boolean;
    omitAndOperator: boolean;
    forceParentheses: boolean;
};

export const defaultSettings: Settings = {
    latex: false,
    darkMode: false,
    omitAndOperator: false,
    forceParentheses: false
};