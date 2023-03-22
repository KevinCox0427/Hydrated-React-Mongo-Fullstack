class JsonTemplater {
    mongoURI:string;
    templates:{[templateName:string]: object} = {};

    constructor(mongoURI:string) {
        this.mongoURI = mongoURI;
    }

    addTemplate(template:object, name:string) {
        this.templates = {...this.templates,
            [name]: template
        };
    }
    

    addItem(templateName:string, item:object) {
        const template = this.templates[templateName];
        if(!template) return false;
        
        function hasSameStructure(templateObject:object, testObject:object): boolean {
            const templateKeys = Object.keys(templateObject);
            const testKeys = Object.keys(testObject);

            // Check if they have the same keys
            if (!templateKeys.every(key => testKeys.includes(key))) return false;

            // Recursively check the structure of each key-value pair
            return templateKeys.every(key => {
                const templateValue:any = templateObject[key as keyof typeof templateObject];
                const testValue:any = testObject[key as keyof typeof testObject];

                // Check that each element of the array has the same structure
                if (Array.isArray(templateValue)) {
                    return Array.isArray(testValue) && testValue.every((element: any) => hasSameStructure(templateValue[0], element));
                }

                // Recursively check the structure of the nested object
                if (typeof templateValue === "object") return hasSameStructure(templateValue, testValue);

                // Check that the value is of the same type
                return typeof testValue === typeof templateValue;
            });
        }
    }
}

export default JsonTemplater;