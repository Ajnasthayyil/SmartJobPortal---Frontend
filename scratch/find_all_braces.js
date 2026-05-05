
const fs = require('fs');
const content = fs.readFileSync('src/app/features/courses/courses.component.html', 'utf8');
let i = 0;
while (i < content.length) {
    if (content[i] === '{') {
        if (content[i+1] === '{') {
            console.log(`Double { at ${i}`);
            i += 2;
        } else {
            console.log(`Single { at ${i}. Context: "${content.substring(Math.max(0, i-10), i+10).replace(/\n/g, '\\n')}"`);
            i++;
        }
    } else {
        i++;
    }
}
