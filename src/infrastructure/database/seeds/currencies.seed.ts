import { DataSource } from 'typeorm';
import { AppDataSource } from '../../../../data-source';
import { CURRENCY_TYPES } from 'src/common/constants/currency.constants';
import { Currency } from '../entities/currency.entity';

type CurrencySeed = Pick<
  Currency,
  'code' | 'name' | 'decimalPlaces' | 'isActive'
>;

const CURRENCY_SEEDS: CurrencySeed[] = [
  {
    code: CURRENCY_TYPES.USD,
    name: 'United States Dollar',
    decimalPlaces: 2,
    isActive: true,
  },
  {
    code: CURRENCY_TYPES.IRR,
    name: 'Iranian Rial',
    decimalPlaces: 0,
    isActive: true,
  },
];

export async function seedCurrencies(
  dataSource: DataSource = AppDataSource,
): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  await dataSource.getRepository(Currency).upsert(CURRENCY_SEEDS, ['code']);
}

async function main(): Promise<void> {
  try {
    await seedCurrencies();
    // eslint-disable-next-line no-console
    console.log('Currency seed completed successfully.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Currency seed failed.', error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

if (require.main === module) {
  void main();
}
