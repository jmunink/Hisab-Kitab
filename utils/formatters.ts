export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const calculateEqualSplit = (amount: number, numPeople: number): number => {
  return parseFloat((amount / numPeople).toFixed(2));
};

export const calculatePercentageSplit = (amount: number, percentage: number): number => {
  return parseFloat(((amount * percentage) / 100).toFixed(2));
};

export const calculateShareSplit = (
  amount: number, 
  shares: number, 
  totalShares: number
): number => {
  return parseFloat(((amount * shares) / totalShares).toFixed(2));
};