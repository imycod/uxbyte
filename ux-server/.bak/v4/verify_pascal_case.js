
function getPageFileName(pageName) {
    if (!pageName) return 'UnknownPage';

    // Remove any leading/trailing whitespace
    const cleanName = pageName.trim();

    // Split by space, hyphen, underscore, or camelCase transitions
    const words = cleanName
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
        .split(/[\s\-_]+/);

    return words
        .map(word => {
            const sanitized = word.replace(/[^a-zA-Z0-9]/g, '');
            if (!sanitized) return '';
            return sanitized.charAt(0).toUpperCase() + sanitized.slice(1).toLowerCase();
        })
        .join('');
}

const testCases = [
    { input: "taskListPage", expected: "TaskListPage" },
    { input: "article list page", expected: "ArticleListPage" },
    { input: "contact-us", expected: "ContactUs" },
    { input: "USER_PROFILE", expected: "UserProfile" },
    { input: "  weirdly  formatted  ", expected: "WeirdlyFormatted" },
    { input: "product123 details", expected: "Product123Details" },
    { input: "mix of-styles_here", expected: "MixOfStylesHere" },
    { input: "alreadyPascalCase", expected: "AlreadyPascalCase" }, // Treated as camelCase split
    { input: "AlreadyPascalCase", expected: "AlreadyPascalCase" }
];

let allPassed = true;
testCases.forEach(test => {
    const result = getPageFileName(test.input);
    if (result !== test.expected) {
        console.error(`FAILED: Input "${test.input}" -> Expected "${test.expected}", Got "${result}"`);
        allPassed = false;
    } else {
        console.log(`PASSED: "${test.input}" -> "${result}"`);
    }
});

if (allPassed) {
    console.log("\nAll tests passed!");
} else {
    console.error("\nSome tests failed.");
    process.exit(1);
}
