const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LOG_FILE = "test_logs.log";
const LOG_URL = "https://limewire.com/d/90794bb3-6831-4e02-8a59-ffc7f3b8b2a3#X1xnzrH5s4H_DKEkT_dfBuUT1mFKZuj4cFWNoMJGX98";

function downloadLogFile() {
    if (!fs.existsSync(LOG_FILE)) {
        console.log("Downloading log file...");
        execSync(`curl -L -o ${LOG_FILE} "${LOG_URL}"`, { stdio: 'inherit' });
    } else {
        console.log("Log file already exists. Skipping download.");
    }
}

function extractLogs(targetDate) {
    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    const outputFile = path.join(outputDir, `output_${targetDate}.txt`);
    
    const readStream = fs.createReadStream(LOG_FILE, 'utf-8');
    const writeStream = fs.createWriteStream(outputFile, 'utf-8');
    
    readStream.on('data', (chunk) => {
        const lines = chunk.split('\n');
        lines.forEach(line => {
            if (line.startsWith(targetDate)) {
                writeStream.write(line + '\n');
            }
        });
    });
    
    readStream.on('end', () => {
        console.log(`Logs for ${targetDate} saved in ${outputFile}`);
    });

    readStream.on('error', (err) => {
        console.error("Error reading log file:", err);
    });
}

if (process.argv.length !== 3) {
    console.log("Usage: node extractLogs.js <YYYY-MM-DD>");
    process.exit(1);
}

const targetDate = process.argv[2];
downloadLogFile();
extractLogs(targetDate);
