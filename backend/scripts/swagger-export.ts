import { specs } from '../src/config/swagger';
import fs from 'fs';
import path from 'path';

const outputPath = path.resolve(__dirname, '../openapi.json');

try {
    fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
    console.log(`✅ OpenAPI spec exported to ${outputPath}`);
} catch (error) {
    console.error('❌ Failed to export OpenAPI spec:', error);
    process.exit(1);
}
