export function camelCaseToTitleCase(camelCase) {
    let result = camelCase
        .replace(/([A-Z])/g, ' $1') 
        .toLowerCase()             
        .trim();                   

    return result.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}