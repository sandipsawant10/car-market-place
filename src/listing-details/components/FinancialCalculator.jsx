import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { int } from "drizzle-orm/mysql-core";

function FinancialCalculator({ carDetail }) {
  const [carPrice, setCarPrice] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const calculateMonthlyPayment = () => {
    const principle = carPrice - downPayment;
    const monthlyInterestRate = interestRate / 1200; //Convert to decimal

    const monthlyPayment =
      (principle *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

    setMonthlyPayment(monthlyPayment.toFixed(2));
  };

  return (
    <div className="p-10 rounded-xl border shadow-md mt-7">
      <h2 className="font-medium text-2xl">Financial Calculator</h2>

      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <label>Price $</label>
          <Input type="number" onChange={(e) => setCarPrice(e.target.value)} />
        </div>

        <div className="w-full">
          <label>Interest Rate</label>
          <Input
            type="number"
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <label>Loan Term (Months)</label>
          <Input type="number" onChange={(e) => setLoanTerm(e.target.value)} />
        </div>

        <div className="w-full">
          <label>Down Payment</label>
          <Input
            type="number"
            onChange={(e) => setDownPayment(e.target.value)}
          />
        </div>
      </div>

      {monthlyPayment > 0 && (
        <h2 className="font-medium text-2xl mt-5">
          Your Monthly Payment :{" "}
          <span className="text-4xl font-bold">${monthlyPayment}</span>{" "}
        </h2>
      )}
      <Button
        onClick={calculateMonthlyPayment}
        className="w-full mt-5"
        size="lg"
      >
        Calculate
      </Button>
    </div>
  );
}

export default FinancialCalculator;
