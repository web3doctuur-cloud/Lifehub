"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CalculatorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isScientific, setIsScientific] = useState(false);
  const [memory, setMemory] = useState<number | null>(null);
  const [fact, setFact] = useState<{ text: string; category: string }>({
    text: "Did you know? π (pi) is the ratio of a circle's circumference to its diameter, approximately 3.14159.",
    category: "Mathematics"
  });

  const mathPhysicsFacts = [
    { text: "The number π (pi) is irrational, meaning it cannot be expressed as a simple fraction. Its decimal representation goes on forever without repeating.", category: "Mathematics" },
    { text: "The speed of light in vacuum is exactly 299,792,458 meters per second.", category: "Physics" },
    { text: "Zero is the only number that can't be represented in Roman numerals.", category: "Mathematics" },
    { text: "E=mc² is Einstein's famous equation showing that energy (E) equals mass (m) times the speed of light (c) squared.", category: "Physics" },
    { text: "A googol is the number 1 followed by 100 zeros. Google's name comes from this mathematical term!", category: "Mathematics" },
    { text: "Quantum entanglement suggests that particles can be connected in such a way that changing one instantly affects the other, regardless of distance.", category: "Physics" },
    { text: "The Fibonacci sequence appears frequently in nature, from sunflower seed arrangements to nautilus shells.", category: "Mathematics" },
    { text: "Absolute zero (-273.15°C) is the theoretical lowest possible temperature where particles stop moving.", category: "Physics" },
    { text: "The number 1729 is known as the Hardy-Ramanujan number - the smallest number expressible as the sum of two cubes in two different ways.", category: "Mathematics" },
    { text: "Gravity travels at the speed of light - about 299,792,458 meters per second!", category: "Physics" },
    { text: "A palindrome number reads the same forwards and backwards. Example: 12321", category: "Mathematics" },
    { text: "Schrödinger's cat is a famous thought experiment showing the paradox of quantum superposition.", category: "Physics" }
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // Change fact every 30 seconds
    const interval = setInterval(() => {
      const randomFact = mathPhysicsFacts[Math.floor(Math.random() * mathPhysicsFacts.length)];
      setFact(randomFact);
    }, 30000);
    return () => clearInterval(interval);
  }, [status, router]);

  const handleClick = (value: string) => {
    if (value === "=") {
      try {
        // Safe evaluation using Function constructor (more secure than eval)
        const calculated = Function('"use strict";return (' + input + ')')();
        setResult(calculated.toString());
      } catch {
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "MC") {
      setMemory(null);
    } else if (value === "MR") {
      if (memory !== null) {
        setInput(prev => prev + memory.toString());
      }
    } else if (value === "M+") {
      if (result) {
        setMemory(parseFloat(result));
      } else if (input) {
        try {
          const calculated = Function('"use strict";return (' + input + ')')();
          setMemory(calculated);
        } catch {
          // Invalid expression
        }
      }
    } else if (value === "√") {
      try {
        const currentValue = input ? Function('"use strict";return (' + input + ')')() : 0;
        const sqrtResult = Math.sqrt(currentValue);
        setInput(sqrtResult.toString());
        setResult(sqrtResult.toString());
      } catch {
        setResult("Error");
      }
    } else if (value === "x²") {
      try {
        const currentValue = input ? Function('"use strict";return (' + input + ')')() : 0;
        const squareResult = currentValue * currentValue;
        setInput(squareResult.toString());
        setResult(squareResult.toString());
      } catch {
        setResult("Error");
      }
    } else if (value === "1/x") {
      try {
        const currentValue = input ? Function('"use strict";return (' + input + ')')() : 0;
        if (currentValue === 0) {
          setResult("Error: Division by zero");
        } else {
          const reciprocalResult = 1 / currentValue;
          setInput(reciprocalResult.toString());
          setResult(reciprocalResult.toString());
        }
      } catch {
        setResult("Error");
      }
    } else if (value === "sin") {
      try {
        const currentValue = input ? Function('"use strict";return (' + input + ')')() : 0;
        const sinResult = Math.sin(currentValue * Math.PI / 180); // Degrees mode
        setInput(sinResult.toString());
        setResult(sinResult.toString());
      } catch {
        setResult("Error");
      }
    } else if (value === "cos") {
      try {
        const currentValue = input ? Function('"use strict";return (' + input + ')')() : 0;
        const cosResult = Math.cos(currentValue * Math.PI / 180);
        setInput(cosResult.toString());
        setResult(cosResult.toString());
      } catch {
        setResult("Error");
      }
    } else if (value === "tan") {
      try {
        const currentValue = input ? Function('"use strict";return (' + input + ')')() : 0;
        const tanResult = Math.tan(currentValue * Math.PI / 180);
        setInput(tanResult.toString());
        setResult(tanResult.toString());
      } catch {
        setResult("Error");
      }
    } else if (value === "log") {
      try {
        const currentValue = input ? Function('"use strict";return (' + input + ')')() : 0;
        if (currentValue <= 0) {
          setResult("Error: log undefined");
        } else {
          const logResult = Math.log10(currentValue);
          setInput(logResult.toString());
          setResult(logResult.toString());
        }
      } catch {
        setResult("Error");
      }
    } else if (value === "ln") {
      try {
        const currentValue = input ? Function('"use strict";return (' + input + ')')() : 0;
        if (currentValue <= 0) {
          setResult("Error: ln undefined");
        } else {
          const lnResult = Math.log(currentValue);
          setInput(lnResult.toString());
          setResult(lnResult.toString());
        }
      } catch {
        setResult("Error");
      }
    } else if (value === "π") {
      setInput(prev => prev + Math.PI.toString());
    } else if (value === "e") {
      setInput(prev => prev + Math.E.toString());
    } else if (value === "(" || value === ")") {
      setInput(prev => prev + value);
    } else if (value === "⌫") {
      setInput(prev => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + value);
    }
  };

  const basicButtons = [
    "7", "8", "9", "/", 
    "4", "5", "6", "*", 
    "1", "2", "3", "-", 
    "0", ".", "=", "+", 
    "C", "⌫"
  ];

  const scientificButtons = [
    "sin", "cos", "tan", "log",
    "ln", "√", "x²", "1/x",
    "π", "e", "(", ")"
  ];

  const memoryButtons = ["MC", "MR", "M+"];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-caribbean-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-anti-flash-white/70">Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rich-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark-green via-rich-black to-bangladesh-green py-8 border-b border-caribbean-green/20">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-caribbean-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-mountain-meadow/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-caribbean-green/10 border border-caribbean-green/30 rounded-full mb-4">
              <svg className="w-5 h-5 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-caribbean-green text-sm">Scientific Calculator</span>
            </div>
            <h1 className="text-4xl font-bold text-anti-flash-white mb-2">
              Calculator <span className="text-caribbean-green">Lab</span>
            </h1>
            <p className="text-anti-flash-white/60">Perform complex calculations with scientific functions</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calculator Main Section */}
            <div className="lg:col-span-2">
              {/* Mode Toggle */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setIsScientific(false)}
                  className={`flex-1 px-6 py-2 rounded-lg transition-all duration-200 ${
                    !isScientific
                      ? "bg-caribbean-green text-rich-black font-medium"
                      : "bg-forest/30 text-anti-flash-white/60 hover:text-caribbean-green border border-forest/50"
                  }`}
                >
                  Basic Mode
                </button>
                <button
                  onClick={() => setIsScientific(true)}
                  className={`flex-1 px-6 py-2 rounded-lg transition-all duration-200 ${
                    isScientific
                      ? "bg-caribbean-green text-rich-black font-medium"
                      : "bg-forest/30 text-anti-flash-white/60 hover:text-caribbean-green border border-forest/50"
                  }`}
                >
                  Scientific Mode
                </button>
              </div>

              {/* Calculator Display */}
              <div className="bg-dark-green/50 backdrop-blur-sm rounded-xl border border-caribbean-green/20 p-6 mb-6">
                <div className="bg-rich-black/80 rounded-lg p-4 mb-4 border border-caribbean-green/10">
                  <div className="text-right">
                    <div className="text-mint/70 text-sm font-mono min-h-[24px]">
                      {memory !== null && `M: ${memory}`}
                    </div>
                    <div className="text-anti-flash-white/80 text-lg font-mono break-all min-h-[32px]">
                      {input || "0"}
                    </div>
                    <div className="text-caribbean-green text-3xl font-mono font-bold break-all">
                      {result && `= ${result}`}
                    </div>
                  </div>
                </div>

                {/* Calculator Buttons */}
                <div className="space-y-3">
                  {/* Memory Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {memoryButtons.map((btn) => (
                      <button
                        key={btn}
                        onClick={() => handleClick(btn)}
                        className="bg-mountain-meadow/20 text-mountain-meadow p-3 rounded-lg text-sm font-semibold hover:bg-mountain-meadow/30 transition-all duration-200 border border-mountain-meadow/20"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>

                  {/* Scientific Functions */}
                  {isScientific && (
                    <div className="grid grid-cols-4 gap-2">
                      {scientificButtons.map((btn) => (
                        <button
                          key={btn}
                          onClick={() => handleClick(btn)}
                          className="bg-caribbean-green/10 text-caribbean-green p-3 rounded-lg text-sm font-semibold hover:bg-caribbean-green/20 hover:text-mint transition-all duration-200 border border-caribbean-green/20"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Basic Calculator Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {basicButtons.map((btn) => (
                      <button
                        key={btn}
                        onClick={() => handleClick(btn)}
                        className={`p-3 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                          btn === "="
                            ? "bg-caribbean-green text-rich-black hover:bg-mint col-span-2 shadow-lg shadow-caribbean-green/20"
                            : btn === "C" || btn === "⌫"
                            ? "bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-600/20"
                            : btn === "/" || btn === "*" || btn === "-" || btn === "+"
                            ? "bg-caribbean-green/15 text-caribbean-green hover:bg-caribbean-green/25 border border-caribbean-green/20"
                            : "bg-forest/40 text-anti-flash-white hover:bg-forest/60 border border-forest/30"
                        }`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Math & Physics Facts Section */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-dark-green/80 to-rich-black rounded-xl border border-caribbean-green/20 p-6 sticky top-24 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${fact.category === "Mathematics" ? "bg-caribbean-green" : "bg-mountain-meadow"}`}></div>
                  <h3 className="text-anti-flash-white font-semibold">Did You Know?</h3>
                </div>
                
                <div className="mb-6">
                  <div className="text-4xl mb-3">
                    {fact.category === "Mathematics" ? "📐" : "⚛️"}
                  </div>
                  <p className="text-anti-flash-white/80 leading-relaxed">
                    {fact.text}
                  </p>
                  <div className="mt-3 inline-block px-2 py-1 bg-caribbean-green/10 rounded text-xs text-mint border border-caribbean-green/20">
                    {fact.category}
                  </div>
                </div>

                <div className="border-t border-caribbean-green/20 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-anti-flash-white/60">Quick Reference</h4>
                    <svg className="w-4 h-4 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-anti-flash-white/50">π (Pi)</span>
                      <span className="text-caribbean-green font-mono">3.14159...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-anti-flash-white/50">e (Euler's number)</span>
                      <span className="text-caribbean-green font-mono">2.71828...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-anti-flash-white/50">√2</span>
                      <span className="text-caribbean-green font-mono">1.41421...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-anti-flash-white/50">Golden Ratio (φ)</span>
                      <span className="text-caribbean-green font-mono">1.61803...</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-caribbean-green/20 pt-4 mt-4">
                  <p className="text-xs text-stone text-center">
                    Facts change every 30 seconds • {mathPhysicsFacts.length} fascinating facts available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}