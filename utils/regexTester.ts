/**
 * Typing the key-value pairs of the inputted regex test syntax.
 */
interface RegexTestInputs {
    [keyName: string]: RegExp | RegexTestInputs
}

/**
 * A utility class to test a given syntax of data against some regular expressions.
 * This is mostly intended to regulate what is valid information on a form to avoid bot spam.
 * You can also nest the data's syntax, as long as it does not contain arrays.
 */
class RegexTester {
    requiredRegexTests: RegexTestInputs;
    optionalRegexTests: RegexTestInputs | null;

    /**
     * @param requiredRegexTests A key-value pair of the required data field names and the regex test.
     * @param optionalRegexTests A key-value pair of the optional data field names and the regex test.
     */
    constructor(requiredRegexTests: RegexTestInputs, optionalRegexTests?: RegexTestInputs) {
        this.requiredRegexTests = requiredRegexTests;
        this.optionalRegexTests = optionalRegexTests ? optionalRegexTests : null;
    }

    /**
     * Runs the regex tests against an inputted data set.
     * 
     * @param data The inputted data set.
     * @param regexTestObject This is mostly to be able to call this function recursively. If you're calling this funciton outside of "regexTester.ts", you don't need to worry about this.
     * @returns A string error message if a regex test fails, or the parsed data set if all regex tests pass.
     */
    runTest(data: object, regexTestObject?: RegexTestInputs): string | object {
        let returnData = {};
        if(!regexTestObject) {
            regexTestObject = {};
            Object.assign(regexTestObject, this.requiredRegexTests);
            Object.assign(regexTestObject, this.optionalRegexTests);
        }

        /**
         * Looping through all the tests.
         */
        for(let i = 0; i < Object.keys(regexTestObject).length; i++) {
            const keyName = Object.keys(regexTestObject)[i];

            /**
             * If it's a required field and it's missing, return an error message.
             */
            if(typeof this.requiredRegexTests[keyName] != 'undefined' && (typeof data[keyName as keyof typeof data] == 'undefined' || data[keyName as keyof typeof data] == '')) {
                return `Error: missing field: ${keyName}`;
            }

            /**
             * If it's an optional field and it's missing, just skip the test entirely.
             */
            if(this.optionalRegexTests && typeof this.optionalRegexTests[keyName] != 'undefined' && (typeof data[keyName as keyof typeof data] == 'undefined' || data[keyName as keyof typeof data] == '')) {
                returnData = {...returnData,
                    [keyName]: ''
                };
                continue;
            }

            /**
             * Now that we're certain the current value is defined, reference it to a variable.
             */
            let value = data[keyName as keyof typeof data] as string | object;

            /**
             * If the current regex test is an object, that means we need to recursively call this funciton.
             */
            if(!(regexTestObject[keyName] instanceof RegExp)) {
                const result = this.runTest(value as object, regexTestObject[keyName] as RegexTestInputs);

                /**
                 * If it returns an error message, return it to the top level in the call stack.
                 */
                if(typeof result == 'string') return result;

                /**
                 * Otherwise, add it to the return data object and iterate to the next loop.
                 */
                returnData = {...returnData,
                    [keyName]: result
                }
                continue;
            }

            /**
             * Now that we're certain that the value is a string, we can type it as so.
             */
            value = value as string;

            /**
             * Then we run the test.
             */
            const result = value.match(regexTestObject[keyName] as RegExp);

            /**
             * If Regex rest completly fails, just return a basic error message.
             */
            if(!result) return `Error: Please provide a valid ${keyName}`;
            /**
             * If Regex test fails but all joined matches are equal to the inputted value, this means it's too long.
             */
            if(result.length > 1 && result.join('') == value) return `Error: ${keyName} exceeds maximum character length.`;
            /**
             * If Regex test fails, then search for the illegal character and send back an error message stating so.
             */
            if(result[0] != value) return `Error: illegal character "${value.split(result[0])[1] == "" ? value.split(result[0])[0] : value.split(result[0])[1]}" in ${keyName}.`;

            /**
             * Now that we're certain it's a valid data field, add it to the returned data object.
             */
            returnData = {...returnData,
                [keyName]: value
            };
        }

        return returnData;
    }
}

export default RegexTester;