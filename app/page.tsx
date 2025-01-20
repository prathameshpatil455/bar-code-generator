"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toPng } from "html-to-image";

interface FormData {
  productName: string;
  productId: string;
  barcode: string;
  price: string;
}

const Home: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    productId: "",
    barcode: "",
    price: "",
  });

  const [barcodeGenerated, setBarcodeGenerated] = useState(false);

  const barcodeRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setBarcodeGenerated(false); // Reset barcode state when inputs change
  };

  const generateBarcode = useCallback(async () => {
    const { productName, productId, barcode, price } = formData;

    if (!productName || !productId || !barcode || !price) {
      alert("Please fill in all fields to generate the barcode.");
      return;
    }

    try {
      if (barcodeRef.current) {
        // Clear any existing barcode content
        barcodeRef.current.innerHTML = "";

        // Generate barcode
        JsBarcode(barcodeRef.current, barcode, {
          format: "CODE128",
          width: 2,
          height: 40,
          displayValue: false,
        });

        // Generate image for download
        // const barcodeUrl = await toPng(barcodeRef.current);
        // setBarcodePreview(barcodeUrl);
        setBarcodeGenerated(true);
      } else {
        console.error("Barcode element is not available.");
        alert("Failed to generate the barcode. Please try again.");
      }
    } catch (error) {
      console.error("Error generating barcode:", error);
      alert("Failed to generate the barcode. Please try again.");
    }
  }, [formData]);

  const downloadBarcode = async () => {
    if (cardRef.current) {
      try {
        const cardImage = await toPng(cardRef.current, {
          cacheBust: true, // Avoid caching issues
          skipFonts: true, // Skip loading fonts if causing issues
          filter: (node) => {
            // Filter out nodes that might cause security issues
            return node.tagName !== "SCRIPT";
          },
        });
        const link = document.createElement("a");
        link.download = "barcode_card.png";
        link.href = cardImage;
        link.click();
      } catch (error) {
        console.error("Error downloading the card image:", error);
        alert("Failed to download the barcode card. Please try again.");
      }
    }
  };

  const resetBarcode = () => {
    setFormData({
      productName: "",
      productId: "",
      barcode: "",
      price: "",
    });
    setBarcodeGenerated(false);
    // Clear the barcode canvas
    if (barcodeRef.current) {
      barcodeRef.current.innerHTML = "";
    }
  };

  useEffect(() => {
    if (barcodeGenerated && barcodeRef.current) {
      JsBarcode(barcodeRef.current, formData.barcode, {
        format: "CODE128",
        width: 2,
        height: 40,
        displayValue: false,
      });
    }
  }, [barcodeGenerated, formData.barcode]);

  return (
    <div className="grid grid-cols-2 min-h-screen bg-gray-100 gap-4 p-6">
      {/* Form Section */}
      <div className="p-6 bg-gray-200 shadow-md rounded-lg flex flex-col items-center justify-center">
        <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
          Barcode Generator
        </h2>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Product Name"
            value={formData.productName}
            onChange={(e) => handleInputChange("productName", e.target.value)}
            className="border-gray-400 w-[300px] max-w-[400px]"
          />
          <Input
            type="text"
            placeholder="Product ID"
            value={formData.productId}
            onChange={(e) => handleInputChange("productId", e.target.value)}
            className="border-gray-400 w-[300px] max-w-[400px]"
          />
          <Input
            type="text"
            placeholder="Barcode Value"
            value={formData.barcode}
            onChange={(e) => handleInputChange("barcode", e.target.value)}
            className="border-gray-400 w-[300px] max-w-[400px]"
          />
          <Input
            type="number"
            placeholder="MRP Price"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            className="border-gray-400 w-[300px] max-w-[400px]"
          />
        </div>
        {!barcodeGenerated ? (
          <Button
            className="w-full max-w-[300px] bg-blue-500 text-white hover:bg-blue-600 mt-4"
            onClick={generateBarcode}
            disabled={
              !formData.productName ||
              !formData.productId ||
              !formData.barcode ||
              !formData.price
            }
          >
            Generate Barcode
          </Button>
        ) : (
          <div className="flex justify-between mt-4 gap-4">
            <Button
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={downloadBarcode}
            >
              Download Barcode
            </Button>
            <Button
              className="bg-gray-500 text-white hover:bg-gray-600"
              onClick={resetBarcode}
            >
              Generate New Barcode
            </Button>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="flex items-center justify-center bg-white shadow-md rounded-lg p-4">
        <Card
          className="w-[250px] h-[130px] border border-gray-300 p-2 flex flex-col items-center justify-center"
          ref={cardRef}
        >
          {/* Product Name */}
          <h3 className="text-xs font-semibold text-center px-2 tracking-wide text-wrap w-full">
            {formData.productName || "Product Name"}
          </h3>

          {/* Product ID */}
          <p className="text-xs font-bold text-center text-wrap w-full mt-1 -mb-1">
            {formData.productId || "Product ID"}
          </p>

          {/* Barcode */}
          <div className="flex flex-col items-center">
            <canvas
              ref={barcodeRef}
              className="w-[150px] h-[40px] bg-white"
            ></canvas>
            <p className="text-xs text-black font-semibold tracking-wide -mt-1">
              {formData.barcode || "Barcode"}
            </p>
          </div>

          {/* MRP Price */}
          <p className="text-sm font-semibold text-gray-800 mt-1">
            MRP: ₹{formData.price || "0.00"}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Home;
