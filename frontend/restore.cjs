const fs = require('fs');

const logPath = 'C:\\Users\\yashaswini\\.gemini\\antigravity\\brain\\be4ed6a0-1f6d-444e-86b3-dab8e4e29bbc\\.system_generated\\logs\\overview.txt';
const logData = fs.readFileSync(logPath, 'utf8');

const lines = logData.split('\n');
const fileStates = {}; // targetFile -> content

for (const line of lines) {
  if (!line.trim() || !line.startsWith('{')) continue;
  try {
    const entry = JSON.parse(line);
    // Stop processing if we hit the step where I started applying the new HTML (around step 620-630)
    if (entry.step_index >= 630) {
        break; // stop applying updates past this point
    }
    
    if (entry.tool_calls) {
      for (const tc of entry.tool_calls) {
        if (tc.name === 'write_to_file') {
          let target = tc.args.TargetFile;
          let content = tc.args.CodeContent;
          if (target && content) {
             if (target.startsWith('"') && target.endsWith('"')) target = JSON.parse(target);
             if (content.startsWith('"') && content.endsWith('"')) content = JSON.parse(content);
             fileStates[target] = content;
          }
        } 
      }
    }
    // Also track file views to get full file content if it was viewed
    if (entry.type === 'VIEW_FILE' && entry.content) {
       // but view_file just shows text, not easy to parse
    }
  } catch(e) {}
}

// Let's print out what we found
for (const [file, content] of Object.entries(fileStates)) {
  console.log(`Found state for: ${file}`);
  fs.writeFileSync(file, content);
}
