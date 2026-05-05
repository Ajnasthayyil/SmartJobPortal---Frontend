
const fs = require('fs');
const content = fs.readFileSync('src/app/features/courses/courses.component.html', 'utf8');
const openCount = (content.match(/{/g) || []).length;
const closeCount = (content.match(/}/g) || []).length;
console.log(`Open: ${openCount}, Close: ${closeCount}`);

const doubleOpen = (content.match(/{{/g) || []).length;
const doubleClose = (content.match(/}}/g) || []).length;
console.log(`Double Open: ${doubleOpen}, Double Close: ${doubleClose}`);

const controlFlowOpen = (content.match(/@\w+\s*\(.*?\)\s*{/g) || []).length;
console.log(`Control Flow Open: ${controlFlowOpen}`);
