import { Column, Entity } from 'typeorm';
import type { CurrencyCode } from 'src/common/types/currency.types';

@Entity('currencies')
export class Currency {
  @Column({ primary: true, length: 3 })
  code: CurrencyCode; // ISO 4217

  @Column()
  name: string;

  @Column({ name: 'decimal_places' })
  decimalPlaces: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
