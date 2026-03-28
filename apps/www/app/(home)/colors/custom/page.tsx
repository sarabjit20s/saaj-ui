'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import Color from 'color';
import Link from 'next/link';

import { generateRadixColors } from '@/lib/generate-radix-colors';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { ColorPalettePreview } from '@/components/color-palette-preview';

const lightModeDefaultColors = {
  primary: '#3D63DD',
  gray: '#8B8D98',
  background: '#FFFFFF',
};

const darkModeDefaultColors = {
  primary: '#3D63DD',
  gray: '#696E77',
  background: '#111111',
};

export default function ColorsPage() {
  const { resolvedTheme } = useTheme();

  const [lightPrimaryValue, setLightPrimaryValue] = useLocalStorage(
    'colors/light/primary',
    lightModeDefaultColors.primary,
  );
  const [lightGrayValue, setLightGrayValue] = useLocalStorage(
    'colors/light/gray',
    lightModeDefaultColors.gray,
  );
  const [lightBgValue, setLightBgValue] = useLocalStorage(
    'colors/light/background',
    lightModeDefaultColors.background,
  );

  const [darkPrimaryValue, setDarkPrimaryValue] = useLocalStorage(
    'colors/dark/primary',
    darkModeDefaultColors.primary,
  );
  const [darkGrayValue, setDarkGrayValue] = useLocalStorage(
    'colors/dark/gray',
    darkModeDefaultColors.gray,
  );
  const [darkBgValue, setDarkBgValue] = useLocalStorage(
    'colors/dark/background',
    darkModeDefaultColors.background,
  );

  const primaryValue =
    resolvedTheme === 'light' ? lightPrimaryValue : darkPrimaryValue;
  const grayValue = resolvedTheme === 'light' ? lightGrayValue : darkGrayValue;
  const bgValue = resolvedTheme === 'light' ? lightBgValue : darkBgValue;

  const setPrimaryValue =
    resolvedTheme === 'light' ? setLightPrimaryValue : setDarkPrimaryValue;
  const setGrayValue =
    resolvedTheme === 'light' ? setLightGrayValue : setDarkGrayValue;
  const setBgValue =
    resolvedTheme === 'light' ? setLightBgValue : setDarkBgValue;

  const lightModeResult = generateRadixColors({
    appearance: 'light',
    accent: lightPrimaryValue,
    gray: lightGrayValue,
    background: lightBgValue,
  });

  const darkModeResult = generateRadixColors({
    appearance: 'dark',
    accent: darkPrimaryValue,
    gray: darkGrayValue,
    background: darkBgValue,
  });

  const result = resolvedTheme === 'light' ? lightModeResult : darkModeResult;

  const primaryScale = result.accentScale;
  const primaryContrastColor = result.accentContrast;
  const primaryScaleAlpha = result.accentScaleAlpha;

  const grayScale = result.grayScale;
  const grayScaleAlpha = result.grayScaleAlpha;

  return (
    <main className="flex flex-1 flex-col gap-5 items-center pt-12 pb-12 text-center px-5 sm:pt-16 md:gap-6">
      <div className="flex flex-col gap-4 items-center">
        <Button className="w-fit" variant={'link'} size="xs" asChild>
          <Link href={'/colors'}>
            <ArrowLeft />
            Colors
          </Link>
        </Button>
        <h1 className="text-3xl font-medium sm:text-4xl">
          Create a custom palette
        </h1>
        <p className="text-md text-fd-foreground max-w-md">
          The colors are generated using the{' '}
          <a
            href="https://www.radix-ui.com/colors"
            target="_blank"
            className="text-nowrap text-blue-600 transition-all hover:opacity-70 dark:text-blue-400"
          >
            Radix Colors
          </a>{' '}
          algorithm. You can change the values below to generate a custom
          palette.
        </p>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <ThemeToggle />
        <div className="flex flex-col gap-4 sm:flex-row">
          <ColorInput
            label="Primary"
            id="primary"
            value={primaryValue}
            onValueChange={setPrimaryValue}
          />
          <ColorInput
            label="Gray"
            id="gray"
            value={grayValue}
            onValueChange={setGrayValue}
          />
          <ColorInput
            label="Background"
            id="background"
            value={bgValue}
            onValueChange={setBgValue}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 max-w-6xl w-full md:flex md:flex-col md:gap-8">
        <ColorPalettePreview
          colorName="primary"
          colorScale={primaryScale}
          colorScaleAlpha={primaryScaleAlpha}
          contrastColor={primaryContrastColor}
        />
        <ColorPalettePreview
          colorName="gray"
          colorScale={grayScale}
          colorScaleAlpha={grayScaleAlpha}
        />
      </div>
    </main>
  );
}

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex flex-row w-fit gap-1 p-0.5 border rounded-full">
      <button
        className="flex flex-row items-center gap-2 p-1 px-2 text-sm text-fd-muted-foreground rounded-full transition-all hover:text-fd-foreground data-[checked=true]:bg-fd-secondary data-[checked=true]:text-fd-foreground"
        onClick={() => setTheme('light')}
        data-checked={resolvedTheme === 'light'}
      >
        <Sun size={16} />
        Light
      </button>
      <button
        className="flex flex-row items-center gap-2 p-2 px-3 text-sm text-fd-muted-foreground rounded-full transition-all hover:text-fd-foreground data-[checked=true]:bg-fd-secondary data-[checked=true]:text-fd-foreground"
        onClick={() => setTheme('dark')}
        data-checked={resolvedTheme === 'dark'}
      >
        <Moon size={16} />
        Dark
      </button>
    </div>
  );
}

function ColorInput({
  label,
  id,
  value,
  onValueChange,
}: {
  label: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const fallbackValue = useRef(value);

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
    fallbackValue.current = value;
  }, [value]);

  return (
    <div className="flex flex-col gap-1 items-start">
      <label htmlFor={id} className="text-sm text-fd-muted-foreground">
        {label}
      </label>
      <div className="flex flex-row gap-2">
        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="Enter a color"
            id={id}
            name={id}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onBlur={(e) => {
              const color = parseColor(e.target.value, fallbackValue.current);
              setInputValue(color);
              onValueChange(color);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            className="pl-1"
          />
          <InputGroupAddon>
            <span
              className="w-6 h-6 -inset-x-1.5 relative rounded-sm border"
              style={{
                backgroundColor: inputValue,
              }}
            >
              <input
                type="color"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                value={inputValue}
                onChange={(e) => {
                  let value = e.target.value.toUpperCase();
                  setInputValue(value);
                  onValueChange(value);
                }}
              />
            </span>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}

function parseColor(color: string, fallbackColor: string) {
  try {
    if (!color.startsWith('#') && /^[0-9A-Fa-f]{6}$/.test(color)) {
      color = `#${color}`;
    }
    return Color(color).hex().toUpperCase();
  } catch (error) {
    return fallbackColor;
  }
}
