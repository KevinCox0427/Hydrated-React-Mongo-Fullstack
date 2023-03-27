/**
 * A Utility Class to generate a templated HTML file to send emails.
 * The constructor will create the template, while the functions use the template to fill in the necessary data and return it as a string.
 */
class EmailGenerator {
    color:string;
    message:string;
    name:string;
    subtitle:string;
    image:string;
    website:string;

    /**
     * @param color Used as the primary color for the template.
     * @param image Will be the image in the top left of the template (Ideally a logo with a low resolution).
     * @param name Used as the title of the header (will be linked to the provided website).
     * @param subtitle Used as the subtitle of the header (ideally a slogan or address).
     * @param message Used as disclaimer / message at the very bottom of the email.
     * @param websiteURL Used to link the headerImage and companyName
     */
    constructor(args: {
        color: string,
        image: string,
        name: string,
        subtitle?: string,
        message: string,
        websiteURL: string,
    }) {
        this.color = args.color;
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
    generateHTMLEmail(subject:string, data:object) {
        /**
         * Generating the head and top of the HTML document.
         */
        const dataTableHTML = `<body style="background-color:#ffffff !important; color:#000000 !important; font-family:'Work Sans', sans-serif;"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet"> 
        <table border="0" cellpadding="0" cellspacing="0" width="600px" style="border-collapse: collapse; margin-left: auto; margin-right: auto; font-size: 16px;">
        <tbody>
            <tr style="background-color:#000000 !important; color:#ffffff !important;">
                <th style="text-align: center; padding-top: 10px; padding-bottom: 10px; width:50% !important;"><a href="${this.website}"><img height="100" width="auto" src="${this.image}"></a></th>
                <th style="text-align:center; font-weight:400; padding-top: 10px; padding-bottom: 10px; width:50% !important;"><a style="font-size:24px; font-weight:500; color:${this.color};" href="${this.website}">${this.name}</a><br>${this.subtitle}</th>
            </tr>
            <tr>
                <td colspan="2" style="font-size:24px;font-weight:500;text-align:center;padding-top:50px;padding-bottom:50px;">${subject}</td>
            </tr>`;

        /**
         * Creating each data field as a table row.
         * This is a function so we can call it recursively for nested data.
         * 
         * @param inputData The current data set that's been inserted into the table.
         * @param nestedIndex The index of how many times this function has been called recursevly. Used to add "padding-left" to the inserted values.
         */
        function createTableRows(inputData: object, nestedIndex: number): string {
            return Object.keys(inputData).map(key => {
                /**
                 * The value at the given key.
                 */
                const value = inputData[key as keyof typeof inputData];

                return `<tr><td style="padding-left: ${10+(nestedIndex*15)}px;padding-top:5px;padding-bottom:5px;padding-right:5px;">${key}:</td><td style="padding-left: ${10+(nestedIndex*15)}px;padding-top:5px;padding-bottom:5px;padding-right:5px;">${typeof value == 'object' ? createTableRows(value, nestedIndex+1) : value}</td></tr>`;
            }).join('');
        }

        /**
         * Making every other table row a grey color.
         */
        const tableRows = createTableRows(data, 0).split('<tr>').map((row, i) => {
            return i % 2 == 0 ? `<tr>${row}` : `<tr style="background-color:#dddddd !important;">${row}`;
        }).join('');

        /**
         * Putting it all together in a full HTML document.
         */
        const fullHTML = `<html xml:lang="en" lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--yahoo fix--></head><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=Edge"><meta name="format-detection" content="telephone=no, date=no, address=no, email=no"><meta name="x-apple-disable-message-reformatting"><title>${this.name} Confirmation Email</title></head>${dataTableHTML}${tableRows}<tr><td colspan="2" style="text-align:center;font-size:18px;padding-top:50px;padding-bottom:50px;font-style:italic;">${this.message}</td></tr></tbody></table></body>`;

        return fullHTML;
    }
}

export default EmailGenerator;