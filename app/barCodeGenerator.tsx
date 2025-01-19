"use client";

import React, { useRef } from "react";
import JsBarcode from "jsbarcode";

const BarcodeGenerator: React.FC = () => {
  const barcodeRef = useRef<HTMLCanvasElement | null>(null);

  const generateBarcode = () => {
    const barcodeValue = "123456789012"; // Example barcode value
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, barcodeValue, {
        format: "CODE128",
        width: 2,
        height: 40,
        displayValue: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-4">Simple Barcode Generator</h1>
      <button
        onClick={generateBarcode}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Generate Barcode
      </button>
      <canvas ref={barcodeRef} className="border p-4 bg-white"></canvas>
    </div>
  );
};

export default BarcodeGenerator;
