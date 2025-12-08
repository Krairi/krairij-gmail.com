export interface StockItem {
  id: string;
  name: string;
  category: 'Food' | 'Household' | 'Hygiene';
  quantity: number;
  unit: string;
  threshold: number;
  status: 'OK' | 'LOW' | 'CRITICAL';
}

export interface ConsumptionData {
  day: string;
  value: number;
}

export enum LocomotionType {
  WALK = 'WALK',
  BIKE = 'BIKE',
  CAR = 'CAR',
  TRANSIT = 'TRANSIT'
}