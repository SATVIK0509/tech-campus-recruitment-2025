const fs = require('fs');
const path = require('path');

function extractLogs(logFile, targetDate) {
    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    const outputFile = path.join(outputDir, `output_${targetDate}.txt`);
    
    const readStream = fs.createReadStream(logFile, 'utf-8');
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

if (process.argv.length !== 4) {
    console.log("Usage: node extractLogs.js <log_file> <YYYY-MM-DD>");
    process.exit(1);
}

const logFile = process.argv[2];
const targetDate = process.argv[3];
extractLogs(logFile, targetDate);
