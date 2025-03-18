import type { Entity, Timestamps } from '@taxel/domain/src/base';
import type {
  CurrencyItem,
  DateItem,
  NumberItem,
  StringItem,
} from '@taxel/domain/src/invoice';

export interface ModelWithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface ModelWithArchivedAt extends ModelWithTimestamps {
  archivedAt: Date | null;
}

export function mapTimestampsToDomain<
  T extends ModelWithTimestamps | ModelWithArchivedAt,
>(dbModel: T): Timestamps {
  const timestamps: Timestamps = {
    createdAt: dbModel.createdAt,
    updatedAt: dbModel.updatedAt,
    archivedAt: null,
  };
  if ('archivedAt' in dbModel) {
    timestamps.archivedAt = dbModel.archivedAt;
  }
  return timestamps;
}

export const createDomainNumberItem = (
  matchedContent: string | null,
  amountValue: string | null,
  confidence: string | null
): NumberItem | undefined => {
  if (!amountValue) {
    return undefined;
  }
  return {
    matchedContent: matchedContent ?? '',
    confidence: confidence ? Number(confidence) : 0,
    value: Number(amountValue),
  };
};

export const createDomainStringItem = (
  matchedContent: string | null,
  value: string | null,
  confidence: string | null
): StringItem | undefined => {
  if (!value) {
    return undefined;
  }
  return {
    matchedContent: matchedContent || '',
    confidence: confidence ? Number(confidence) : 0,
    value: value,
  };
};

export const createDomainDateItem = (
  matchedContent: string | null,
  value: string | null,
  confidence: string | null
): DateItem | undefined => {
  if (!value) {
    return undefined;
  }
  return {
    matchedContent: matchedContent || '',
    confidence: confidence ? Number(confidence) : 0,
    value: value,
  };
};

export const createDomainCurrencyItem = (
  matchedContent: string | null,
  amountValue: string | null,
  confidence: string | null,
  currencyCode: string | null
): CurrencyItem | undefined => {
  if (matchedContent === null) {
    return undefined;
  }
  return {
    matchedContent: matchedContent ?? '',
    confidence: confidence ? Number(confidence) : 0,
    currency: {
      amount: amountValue ? Number(amountValue) : 0,
      currencyCode: currencyCode ?? '',
    },
  };
};

export const parseToDecimal = (value?: number): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  return value.toFixed(12);
};

export function removeTimestamps<E extends Entity<any>>(
  obj: E
): Omit<ReturnType<E['toJSON']>, 'createdAt' | 'updatedAt'> {
  const { createdAt, updatedAt, ...rest } = obj.toJSON();
  return rest;
}
