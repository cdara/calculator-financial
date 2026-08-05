import katex from "katex";
import "katex/dist/katex.min.css";

interface MathFormulaProps {
  formula: string;
}

export function MathFormula({ formula }: MathFormulaProps) {
  const renderedFormula = katex.renderToString(formula, {
    displayMode: true,
    throwOnError: false,
  });

  return (
    <div
      className="math-formula"
      dangerouslySetInnerHTML={{
        __html: renderedFormula,
      }}
    />
  );
}