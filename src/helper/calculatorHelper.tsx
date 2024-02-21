import * as feeConstants from "../constants/deliveryFeeConstants";

const {
  CARD_SURCHARGE_LIMIT,
  BASE_DELIVERY_FEE,
  EXTRA_DELIVERY_FEE,
  EXTRA_ITEM_SURCHARGE,
  EXTRA_BULK,
  FRIDAY_RUSH_START,
  FRIDAY_RUSH_END,
  RUSH_HOUR_SURCHARGE_MULTIPLIER,
} = feeConstants;

export const smallOrderSurchargeCalculator = (cartValue: number): number => {
  if (cartValue >= CARD_SURCHARGE_LIMIT) {
    return 0;
  } else {
    return CARD_SURCHARGE_LIMIT - cartValue;
  }
};

export const distanceSurchargeCalculator = (distance: number): number => {
  if (distance <= 1000) {
    return BASE_DELIVERY_FEE;
  } else {
    return (
      BASE_DELIVERY_FEE +
      Math.ceil((distance - 1000) / 500) * EXTRA_DELIVERY_FEE
    );
  }
};

export const itemSurchargeCalculator = (numberOfItems: number): number => {
  let ExtraItems = Math.max(0, numberOfItems - 4) * EXTRA_ITEM_SURCHARGE;
  return numberOfItems > 12 ? ExtraItems + EXTRA_BULK : ExtraItems;
};

export const rushHourCalculator = (orderTime: string): number => {
  const orderDate = new Date(orderTime);

  // Check if the order day is Friday
  const isFriday = orderDate.getUTCDay() === 5;
  const isRushHour =
    isFriday &&
    orderDate.getUTCHours() >= FRIDAY_RUSH_START &&
    orderDate.getUTCHours() < FRIDAY_RUSH_END;

  if (isRushHour) {
    return RUSH_HOUR_SURCHARGE_MULTIPLIER;
  } else {
    return 1;
  }
};
