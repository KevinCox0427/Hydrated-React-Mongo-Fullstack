/**
 * Typing our table's data to be sure that any data to be inserted into the email templates contains only objects, strings, numbers, and booleans.
 */
type TableData = { 
    [key: string]: string | number | boolean | TableData
}

/**
 * A Utility Class to generate a templated HTML file to send emails.
 * The constructor will create the template, while the functions use the template to fill in the necessary data and return it as a string.
 */
class emailGenerator {
    color:string;
    message:string;
    name:string;
    subtitle:string;
    image:string;
    website:string;

    /**
     * @param brandHexCode Used as the primary color for the template.
     * @param headerImage Will be the image in the top left of the template (Ideally a logo with a low resolution).
     * @param companyName Used as the title of the header (will be linked to the provided website).
     * @param headerSubtitle Used as the subtitle of the header (ideally a slogan or address).
     * @param message Used as disclaimer / message at the very bottom of the email.
     * @param websiteURL Used to link the headerImage and companyName
     */
    constructor(args: {
        brandHexCode: string,
        image: string,
        name: string,
        subtitle?: string,
        message: string,
        websiteURL: string,
    }) {
        this.color = args.brandHexCode;
        this.name = args.name;
        this.image = args.image;
        this.website = args.websiteURL;
        this.subtitle = args.subtitle ? args.subtitle : '';
        this.message = args.message;
    }

    /**
     * Fills in the templated email with data in a table format.
     * This one is inteneded for the customer, so this will include the disclaimer as the bottom.
     * 
     * @param subject The message at the very top of the email.
     * @param data The inserted data. All data MUST be an object but can be nested.
     * @returns an HTML email in a string format.
     */
    generateHTMLEmail(subject:string, data:TableData) {
        /**
         * Creating the HTML table for each of the data fields represented as a table row.
         */
        const dataTableHTML = `<table></table>`;

        /**
         * Creating each data field as a table row.
         * This is a function so we can call it recursively for nested data.
         * 
         * @param inputData The current data set that's been inserted into the table.
         * @param nestedIndex The index of how many times this function has been called recursevly. Used to add "padding-left" to the inserted values.
         */
        function createTableRows(inputData: TableData, nestedIndex: number): string {
            return Object.keys(inputData).map(key => {
                if(typeof inputData[key] == 'object') {
                    return `<tr class="DataTableRow"><td class="DataTableEntry" style="padding-left: ${1+(nestedIndex*1.25)}em">${key}:</td><td class="DataTableEntry" style="padding-left: ${1+(nestedIndex*1.25)}em">${key}:</td></tr>${createTableRows(inputData[key] as TableData, nestedIndex+1)}`;
                }
                else return `<tr class="DataTableRow"><td class="DataTableEntry" style="padding-left: ${1+(nestedIndex*1.25)}em">${key}</td><td class="DataTableEntry" style="padding-left: ${1+(nestedIndex*1.25)}em">${inputData[key]}</td></tr>`;
            }).join('');
        }

        /**
         * Putting it all together in a full HTML document.
         */
        const fullHTML = `<html xml:lang="en" lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--yahoo fix--></head><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=Edge"><meta name="format-detection" content="telephone=no, date=no, address=no, email=no"><meta name="x-apple-disable-message-reformatting"><title>${this.name} Inquiry Confirmation Email</title></head>`;

        return fullHTML;
    }
}

export default emailGenerator;
export type { TableData };