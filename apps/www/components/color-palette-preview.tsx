import { useEffect, useState } from 'react';
import Color from 'colorjs.io';
import { Check, CircleDot, Clipboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

function ColorPalettePreview({
  colorName,
  colorScale,
  colorScaleAlpha,
  contrastColor,
}: {
  colorName: string;
  colorScale: string[];
  colorScaleAlpha: string[];
  contrastColor?: string;
}) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  function handleCopyScale() {
    if (copied) return;

    const colorScaleCopyObj: Record<string, string> = {};
    const colorScaleAlphaCopyObj: Record<string, string> = {};

    for (let i = 1; i <= colorScale.length; i++) {
      colorScaleCopyObj[`${colorName + i}`] = colorScale[i - 1];
    }
    for (let i = 1; i <= colorScaleAlpha.length; i++) {
      colorScaleAlphaCopyObj[`${colorName + 'A' + i}`] = colorScaleAlpha[i - 1];
    }

    const clipboardPayload = `const ${colorName}${resolvedTheme === 'dark' ? 'Dark' : ''} = {
  ${Object.entries(colorScaleCopyObj)
    .map(([key, value]) => `${key}: "${value}",`)
    .join('\n  ')}

  ${Object.entries(colorScaleAlphaCopyObj)
    .map(([key, value]) => `${key}: "${value}",`)
    .join(
      '\n  ',
    )}${contrastColor ? `\n\n  ${colorName}Contrast: "${contrastColor}",` : ''}
};`;

    try {
      window.navigator.clipboard.writeText(clipboardPayload).then(() => {
        setCopied(true);
      });
    } catch (error) {
      if (error instanceof TypeError) {
        window.alert('Clipboard not available');
      } else {
        console.error('Error copying to clipboard:', error);
      }
    }
  }

  const Icon = copied ? Check : Clipboard;

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="flex flex-row gap-2 items-center justify-between w-full">
        <h3 className="text-md capitalize">{colorName}</h3>
        <Button variant="outline" size="xs" onClick={handleCopyScale}>
          <Icon />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="flex flex-1 w-full flex-col gap-0.5 md:flex-row md:gap-1 lg:gap-1">
        {colorScale.map((color, i) => (
          <ColorSwatch key={i} color={color.toUpperCase()} step={i + 1} />
        ))}
      </div>
    </div>
  );
}

function ColorSwatch({ color, step }: { color: string; step: number }) {
  const fgColor = getContrastColor(color);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  function handleCopy() {
    if (copied) return;

    try {
      window.navigator.clipboard.writeText(color).then(() => {
        setCopied(true);
      });
    } catch (error) {
      if (error instanceof TypeError) {
        window.alert('Clipboard not available');
      } else {
        console.error('Error copying to clipboard:', error);
      }
    }
  }

  const Icon = copied ? Check : Clipboard;

  return (
    <button
      className="relative flex-1 w-auto h-auto aspect-[4/1] rounded-md border border-fd-border/30 transition-all hover:border-fd-foreground hover:ring-1 hover:ring-fd-foreground [&>svg]:transition-all [&:hover>svg]:opacity-100 md:aspect-[1/1.25]"
      style={{ backgroundColor: color }}
      onClick={handleCopy}
      aria-label="Copy color"
      title="Copy color"
    >
      <Icon
        size={12}
        color={fgColor}
        className="absolute top-1 right-1 opacity-0 data-[copied=true]:opacity-100"
        data-copied={copied}
      />
      {step === 9 && (
        <CircleDot
          size={12}
          color={fgColor}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !opacity-100"
        />
      )}
      <span
        className="font-mono text-[0.65rem] absolute left-1.5 top-1"
        style={{
          color: fgColor,
        }}
      >
        {step}
      </span>
    </button>
  );
}

function getContrastColor(background: string) {
  const white = new Color('#fff');
  const black = new Color('#000');

  try {
    const backgroundColor = new Color(background);

    if (Math.abs(backgroundColor.contrastAPCA(white)) < 60) {
      const [L, C, H] = backgroundColor.coords;
      return new Color('oklch', [0.25, Math.max(0.08 * C, 0.04), H]).toString();
    }

    return white.toString();
  } catch (error) {
    return white.toString();
  }
}

export { ColorPalettePreview };
