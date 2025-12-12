
const CURRENCY_MAP = {}; // Mock
function parseNumber(raw: string): number {
    const cleaned = raw;
    if (cleaned.includes(',') && cleaned.includes('.')) {
        if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
            return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')); // 1.234,56
        } else {
            return parseFloat(cleaned.replace(/,/g, '')); // 1,234.56
        }
    } else if (cleaned.includes(',')) {
        const parts = cleaned.split(',');
        if (parts[parts.length - 1].length === 2) {
            return parseFloat(cleaned.replace(',', '.')); // 12,99
        } else {
            return parseFloat(cleaned.replace(/,/g, '')); // 1,299
        }
    }
    return parseFloat(cleaned);
}

function parsePrice(priceText: string | number): number {
    if (typeof priceText === 'number') return priceText;
    const text = String(priceText).trim();
    if (!text) return 0;

    console.log(`Analyzing: "${text}"`);

    // 1. Strict Currency Match First
    const strictMatch = text.match(/[\$€£₹¥]\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/);
    if (strictMatch) {
        console.log(`Strict match found: "${strictMatch[1]}" from "${strictMatch[0]}"`);
        return parseNumber(strictMatch[1]);
    } else {
        console.log("No strictly formatted match found");
    }

    // 2. Look for "price" keyword context
    const priceContextMatch = text.match(/price\s*:?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/i);
    if (priceContextMatch) {
        console.log(`Context match found: "${priceContextMatch[1]}"`);
        return parseNumber(priceContextMatch[1]);
    }

    // 3. General Number Extraction
    const potentialNumbers = text.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?|\d+)/g);
    if (potentialNumbers) {
        console.log(`Potential numbers: ${JSON.stringify(potentialNumbers)}`);
        for (const numStr of potentialNumbers) {
            // Unit check ... (simplified for test)
            const escapedNum = numStr.replace(/\./g, '\\.');
            const unitCheckRegex = new RegExp(`${escapedNum}\\s*(V|Ah|in|mm|cm|W|lm|kg|g|lb|oz|MHz|Hz|GB|MB|TB)`, 'i');
            if (unitCheckRegex.test(text)) {
                console.log(`Ignored unit: ${numStr}`);
                continue;
            }

            const val = parseNumber(numStr);
            console.log(`Parsed value: ${val}`);
            return val;
        }
    }

    return 0;
}

// Test cases
console.log('--- Test Case 1: $248.00 ---');
console.log('Result:', parsePrice('$248.00'));

console.log('\n--- Test Case 2: Now $248.00 ---');
console.log('Result:', parsePrice('Now $248.00'));

console.log('\n--- Test Case 3: $248 ---');
console.log('Result:', parsePrice('$248'));

console.log('\n--- Test Case 4: $24800 (HTML text concatenation) ---');
console.log('Result:', parsePrice('$24800'));

console.log('\n--- Test Case 5: 248 (No currency) ---');
console.log('Result:', parsePrice('248'));

console.log('\n--- Test Case 6: $ 248.00 ---');
console.log('Result:', parsePrice('$ 248.00'));

console.log('\n--- Test Case 7: Mixed text ---');
console.log('Result:', parsePrice('Now $248.00 $101.99 saved'));
