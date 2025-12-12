
function parseNumber(raw) {
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

function parsePrice(priceText) {
    if (typeof priceText === 'number') return priceText;
    const text = String(priceText).trim();
    if (!text) return 0;

    // --- PROPOSED FIX START ---
    // Remove spaces only for the strict currency match attempt
    // This handles "2 4 8" or "$ 2 4 8" becoming "$248"
    const cleanText = text.replace(/\s+/g, '');
    const strictMatchClean = cleanText.match(/[\$€£₹¥](\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/);
    if (strictMatchClean) {
        console.log(`[Cleaned] Strict match found: "${strictMatchClean[1]}" from "${strictMatchClean[0]}"`);
        return parseNumber(strictMatchClean[1]);
    }
    // --- PROPOSED FIX END ---

    console.log(`Analyzing: "${text}"`);

    // 1. Strict Currency Match First (Original)
    const strictMatch = text.match(/[\$€£₹¥]\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/);
    if (strictMatch) {
        console.log(`Strict match found: "${strictMatch[1]}" from "${strictMatch[0]}"`);
        return parseNumber(strictMatch[1]);
    }

    // ... (Rest of function)
    const potentialNumbers = text.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?|\d+)/g);
    if (potentialNumbers) {
        // Simple return for test
        return parseNumber(potentialNumbers[0]);
    }
    return 0;
}

console.log('\n--- Test Case 8: $2 4 8.00 (Spaces in digits) ---');
console.log('Result:', parsePrice('$2 4 8.00'));

console.log('\n--- Test Case 9: Now $ 2 4 8 . 0 0 ---');
console.log('Result:', parsePrice('Now $ 2 4 8 . 0 0'));

console.log('\n--- Test Case 10: $24 8.00 ---');
console.log('Result:', parsePrice('$24 8.00'));
