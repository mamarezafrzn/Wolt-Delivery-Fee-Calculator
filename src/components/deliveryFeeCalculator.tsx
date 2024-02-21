import React, { useState } from "react";
import styles from "./deliveryFeeCalculator.module.css";
import {
  MAXIMUM_DELIVERY_FEE,
  FREE_DELIVERY_ELIGIBILITY,
} from "../constants/deliveryFeeConstants";
import {
  smallOrderSurchargeCalculator,
  distanceSurchargeCalculator,
  itemSurchargeCalculator,
  rushHourCalculator,
} from "../helper/calculatorHelper";

const DeliveryFeeCalculator: React.FC = () => {
  const [cartValue, setCartValue] = useState(0);
  const [distance, setDistance] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState<number>();
  const [orderTime, setOrderTime] = useState(
    new Date().toISOString().slice(0, -8)
  );
  const [inputErrors, setInputErrors] = useState({
    cartValueError: false,
    distanceError: false,
    numberOfItemsError: false,
    orderTimeError: false,
  });

  const calculateDeliveryPrice = () => {
    let totalCost = 0;
    if (cartValue <= FREE_DELIVERY_ELIGIBILITY) {
      totalCost += smallOrderSurchargeCalculator(cartValue);
      totalCost += distanceSurchargeCalculator(distance);
      totalCost += itemSurchargeCalculator(numberOfItems);
      totalCost *= rushHourCalculator(orderTime);
    }

    // Set the delivery price, ensuring it doesn't exceed the maximum fee
    setDeliveryPrice(Math.min(totalCost, MAXIMUM_DELIVERY_FEE));
  };
  
  const validateInputs = () => {
    const errors = {
      cartValueError: !(cartValue > 0),
      distanceError: !(distance > 0),
      numberOfItemsError: !(numberOfItems > 0),
      orderTimeError: orderTime.trim() === "",
    };
    setInputErrors(errors);
    return Object.values(errors).some(Boolean);
  };
  const onFormSubmit = (e: React.FormEvent) => {
    //Checks if the inputs are filled properly before calculating the cost
    e.preventDefault();
    const hasErrors = validateInputs();
    if (!hasErrors) {
      calculateDeliveryPrice();
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Delivery Fee Calculator</h1>
      <form className={styles.deliveryCalculatorForm} onSubmit={onFormSubmit}>
        <label htmlFor="CartValue">
          Cart Value &euro;{" "}
          <input
          id="CartValue"
            type="number"
            name="CartValue"
            value={cartValue || ""}
            onChange={(e) => setCartValue(parseFloat(e.target.value))}
            className={inputErrors.cartValueError ? styles.inputError : ""}
          />
          {inputErrors.cartValueError && <p>Cart value is required</p>}
        </label>
        <label htmlFor="deliveryDistance">
          Delivery distance(m){" "}
          <input
          id="deliveryDistance"
            type="number"
            name="deliveryDistance"
            value={distance || ""}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className={inputErrors.distanceError ? styles.inputError : ""}
          />
          {inputErrors.distanceError && <p>Distance is required</p>}
        </label>
        <label htmlFor="amountOfItems">
          Amount of items{" "}
          <input
          id="amountOfItems"
            type="number"
            name="amountOfItems"
            onChange={(e) => setNumberOfItems(parseInt(e.target.value))}
            value={numberOfItems || ""}
            className={inputErrors.numberOfItemsError ? styles.inputError : ""}
          />
          {inputErrors.numberOfItemsError && <p>Amount of items is required</p>}
        </label>
        <label htmlFor="inputTime">
          Time
          <input
          id="inputTime"
            type="datetime-local"
            value={orderTime}
            onChange={(e) => setOrderTime(e.target.value)}
            className={inputErrors.orderTimeError ? styles.inputError : ""}
          />
          {inputErrors.orderTimeError && <p>Order time is required</p>}
        </label>
        <button type="submit">Calculate delivery price</button>
        {typeof deliveryPrice !== "number" ||
        inputErrors.cartValueError ||
        inputErrors.distanceError ||
        inputErrors.numberOfItemsError ||
        inputErrors.orderTimeError ? (
          <p>Delivery price : -</p>
        ) : (
          <p>Delivery price : {deliveryPrice.toFixed(2)} &euro;</p>
        )}
      </form>
    </div>
  );
};

export default DeliveryFeeCalculator;
