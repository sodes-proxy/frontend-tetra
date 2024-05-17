const extractNumericValue = (formattedValue) => {
    return formattedValue.replace(/[^0-9.]/g, '');
};

const formatValue = (inputValue, allowZero) => {
    // Remove non-numeric characters except decimal point
    let numericValue = inputValue.replace(/[^0-9.]/g, '');
    // Remove leading zeros from the integer part
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/^0?(?=\d)|^(0)$/, '');
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
    }
    // Ensure there's at most one decimal point
    if (parts.length > 2) {
        numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    // Format the integer part with commas as thousand separators
    const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Combine the integer and decimal parts
    const formattedValue = parts.length === 1 ? formattedInteger : formattedInteger + '.' + parts[1];
    
    // Return zero if allowZero is true and input value is empty
    if (allowZero && (inputValue === '0')) {
        return '0';
    }
    
    return formattedValue;
};


const getValueInNumber = (value, isDollarSign, canBeZero) => {
    // Format the input value
    var formattedValue = formatValue(value, canBeZero);
    const numericValue = extractNumericValue(value);
    var prefix = '';
    // Update the state with the formatted value
    if (isDollarSign){
        prefix = '$';
    }
    if (parseFloat(numericValue) <= 0 && !canBeZero){
        formattedValue = '';
    }
    else if (parseFloat(numericValue) < 0){
        formattedValue = '';
    }

    return prefix + formattedValue;

}

export { extractNumericValue, getValueInNumber }