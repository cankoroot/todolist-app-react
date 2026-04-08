import { readFileSync, writeFileSync } from 'node:fs';

const DB_PATH = 'src/components/db.json';

try {
    const fileContent = readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(fileContent);

    if (data && typeof data === 'object' && '$schema' in data) {
        delete data.$schema;
        writeFileSync(DB_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
        console.log('Removed $schema from db.json');
    }
} catch (error) {
    console.error('Failed to clean db.json:', error.message);
    process.exit(1);
}
