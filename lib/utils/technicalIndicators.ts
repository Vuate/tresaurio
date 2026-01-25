// lib/utils/technicalIndicators.ts

/**
 * Calculate RSI (Relative Strength Index)
 *
 * @param closes - Array of closing prices
 * @param period - RSI period (default: 14)
 * @returns RSI value (0-100) or null if insufficient data
 */
export function calculateRSI(closes: number[], period: number = 14): number | null {
  if (closes.length < period + 1) {
    return null;
  }

  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }

  // Calculate initial average gain and loss
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i];
    } else {
      avgLoss += Math.abs(changes[i]);
    }
  }

  avgGain /= period;
  avgLoss /= period;

  // Calculate smoothed RS for remaining periods
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
    }
  }

  // Avoid division by zero
  if (avgLoss === 0) {
    return 100;
  }

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return Math.round(rsi * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate SMA (Simple Moving Average)
 */
export function calculateSMA(values: number[], period: number): number | null {
  if (values.length < period) {
    return null;
  }

  const sum = values.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

/**
 * Calculate EMA (Exponential Moving Average)
 */
export function calculateEMA(values: number[], period: number): number | null {
  if (values.length < period) {
    return null;
  }

  const multiplier = 2 / (period + 1);

  // Start with SMA
  const sma = calculateSMA(values.slice(0, period), period);
  if (sma === null) return null;

  let ema = sma;

  // Calculate EMA for remaining values
  for (let i = period; i < values.length; i++) {
    ema = (values[i] - ema) * multiplier + ema;
  }

  return ema;
}
