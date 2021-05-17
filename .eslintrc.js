module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    // "extends": "eslint:recommended",
    "extends": "standard",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "react-native"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            {"SwitchCase": 1}
        ],
        "no-trailing-spaces": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-unused-vars": [
            "error",
            {"vars": "all", "args": "after-used", "ignoreRestSiblings": false}
        ],
        "comma-dangle": 0,
        "no-multiple-empty-lines": 0,
        "padded-blocks": 0,
        "camelcase": 0,
        "space-before-function-paren": 0,
        "react-native/no-unused-styles": 2,
        "react-native/split-platform-components": 2,
        "react-native/no-inline-styles": 0,
        "react-native/no-color-literals": 0,
        "react/jsx-uses-vars": 2
    }
};
