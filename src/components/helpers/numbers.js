const extractNumericValue = (formattedValue) => {
    return formattedValue.replace(/[^0-9.]/g, '');
};

const formatValue = (inputValue) => {
    // Remove non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, '');
    // Remove leading zeros from the integer part
    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/^0+/, '');
    // Format the integer part with commas as thousand separators
    const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Combine the integer and decimal parts with a dollar sign
    return (parts.length === 1 ? formattedInteger : formattedInteger + '.' + parts[1]);
};

const getValueInNumber = (value, isDollarSign) => {
    // Format the input value
    var formattedValue = formatValue(value);
    const numericValue = extractNumericValue(value);
    var prefix = '';
    // Update the state with the formatted value
    if (isDollarSign){
        prefix = '$';
    }
    if (parseFloat(numericValue) <= 0){
        formattedValue = '';
    }
    return prefix + formattedValue;

}

export { extractNumericValue, getValueInNumber }