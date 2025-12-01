import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// --- CSS Styles ---
const styles = `
  .calculator-container {
    background-color: #000000;
    width: 320px;
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .display {
    height: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 0 10px;
    margin-bottom: 10px;
    word-break: break-all;
    overflow: hidden;
  }

  .display-text {
    color: white;
    font-size: 3.5rem;
    font-weight: 300;
    line-height: 1;
  }

  .keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .btn {
    height: 65px;
    width: 65px;
    border-radius: 50%;
    border: none;
    font-size: 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: filter 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .btn:active {
    filter: brightness(1.3);
  }

  .btn-gray {
    background-color: #333333;
    color: white;
  }

  .btn-light-gray {
    background-color: #a5a5a5;
    color: black;
  }

  .btn-orange {
    background-color: #ff9f0a;
    color: white;
    font-size: 1.75rem;
    padding-bottom: 3px; /* visual alignment for operators */
  }

  /* Specific adjustment for the zero button which spans two columns */
  .btn-zero {
    grid-column: span 2;
    width: 100%;
    border-radius: 40px;
    justify-content: flex-start;
    padding-left: 25px;
  }
`;

type Operator = "+" | "-" | "×" | "÷" | "=" | null;

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [operator, setOperator] = useState<Operator>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const clear = () => {
    setDisplayValue("0");
    setOperator(null);
    setPreviousValue(null);
    setWaitingForNewValue(false);
  };

  const toggleSign = () => {
    const value = parseFloat(displayValue);
    if (value === 0) return;
    setDisplayValue(String(value * -1));
  };

  const inputPercent = () => {
    const value = parseFloat(displayValue);
    setDisplayValue(String(value / 100));
  };

  const inputDigit = (digit: string) => {
    if (waitingForNewValue) {
      setDisplayValue(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  };

  const inputDot = () => {
    if (waitingForNewValue) {
      setDisplayValue("0.");
      setWaitingForNewValue(false);
    } else if (displayValue.indexOf(".") === -1) {
      setDisplayValue(displayValue + ".");
    }
  };

  const performOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(displayValue);

    if (previousValue == null) {
      setPreviousValue(String(inputValue));
    } else if (operator) {
      const currentValue = previousValue ? parseFloat(previousValue) : 0;
      const newValue = calculate(currentValue, inputValue, operator);

      setPreviousValue(String(newValue));
      setDisplayValue(String(newValue));
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: Operator): number => {
    switch (op) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "×":
        return first * second;
      case "÷":
        return second === 0 ? 0 : first / second;
      default:
        return second;
    }
  };

  // Adjust font size based on length
  const getFontSize = () => {
    const length = displayValue.length;
    if (length > 10) return "2rem";
    if (length > 7) return "2.5rem";
    return "3.5rem";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="calculator-container">
        <div className="display">
          <span className="display-text" style={{ fontSize: getFontSize() }}>
            {displayValue.replace(".", ",")}
          </span>
        </div>
        <div className="keypad">
          {/* Row 1 */}
          <button className="btn btn-light-gray" onClick={clear}>
            {displayValue === "0" ? "AC" : "C"}
          </button>
          <button className="btn btn-light-gray" onClick={toggleSign}>
            +/-
          </button>
          <button className="btn btn-light-gray" onClick={inputPercent}>
            %
          </button>
          <button className="btn btn-orange" onClick={() => performOperation("÷")}>
            ÷
          </button>

          {/* Row 2 */}
          <button className="btn btn-gray" onClick={() => inputDigit("7")}>
            7
          </button>
          <button className="btn btn-gray" onClick={() => inputDigit("8")}>
            8
          </button>
          <button className="btn btn-gray" onClick={() => inputDigit("9")}>
            9
          </button>
          <button className="btn btn-orange" onClick={() => performOperation("×")}>
            ×
          </button>

          {/* Row 3 */}
          <button className="btn btn-gray" onClick={() => inputDigit("4")}>
            4
          </button>
          <button className="btn btn-gray" onClick={() => inputDigit("5")}>
            5
          </button>
          <button className="btn btn-gray" onClick={() => inputDigit("6")}>
            6
          </button>
          <button className="btn btn-orange" onClick={() => performOperation("-")}>
            -
          </button>

          {/* Row 4 */}
          <button className="btn btn-gray" onClick={() => inputDigit("1")}>
            1
          </button>
          <button className="btn btn-gray" onClick={() => inputDigit("2")}>
            2
          </button>
          <button className="btn btn-gray" onClick={() => inputDigit("3")}>
            3
          </button>
          <button className="btn btn-orange" onClick={() => performOperation("+")}>
            +
          </button>

          {/* Row 5 */}
          <button className="btn btn-gray btn-zero" onClick={() => inputDigit("0")}>
            0
          </button>
          <button className="btn btn-gray" onClick={inputDot}>
            ,
          </button>
          <button className="btn btn-orange" onClick={() => performOperation("=")}>
            =
          </button>
        </div>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Calculator />);
