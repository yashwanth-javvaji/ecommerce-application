export const numberToCurrency = (value, locale, currency) => (
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
    }).format(value)
);