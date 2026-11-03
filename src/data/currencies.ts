/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyCode, CurrencyConfig } from '../types/travel';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateFromInr: 1.0 },
  USD: { code: 'USD', symbol: '$', rateFromInr: 1 / 86.5 },
  EUR: { code: 'EUR', symbol: '€', rateFromInr: 1 / 93.0 },
  GBP: { code: 'GBP', symbol: '£', rateFromInr: 1 / 110.0 },
};

export function formatInrPrice(amountInInr: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = amountInInr * config.rateFromInr;

  if (config.code === 'INR') {
    return `${config.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }
  return `${config.symbol}${converted.toFixed(config.code === 'USD' ? 2 : 2)}`;
}

// Backward compatibility helper for USD inputs
export function formatPrice(amountInUsd: number, currency: CurrencyCode): string {
  const inrEquivalent = amountInUsd * 86.5;
  return formatInrPrice(inrEquivalent, currency);
}
