'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';

import lightColors from '@/public/r/colors/light.json';
import darkColors from '@/public/r/colors/dark.json';
import { Button } from '@/components/ui/button';
import { ColorPalettePreview } from '@/components/color-palette-preview';
import { Callout } from '@/components/callout';

const result: { name: string; label: string }[] = [];

for (const colorName of Object.keys(lightColors)) {
  result.push({
    name: colorName,
    label: colorName.slice(0, 1).toUpperCase() + colorName.slice(1),
  });
}
console.log(result);

export default function Page() {
  const { resolvedTheme } = useTheme();

  const colors = resolvedTheme === 'light' ? lightColors : darkColors;

  // filter out the alpha colors
  const filteredColors = Object.entries(colors).filter(
    ([key]) => !key.endsWith('A'),
  );

  return (
    <main className="flex flex-1 flex-col gap-5 items-center pt-12 pb-12 text-center px-5 sm:pt-16 md:gap-6">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-medium sm:text-4xl">Radix Colors</h1>
        <p className="text-md text-fd-foreground max-w-md">
          A curated collection of{' '}
          <a
            href="https://www.radix-ui.com/colors"
            target="_blank"
            className="text-nowrap text-blue-600 transition-all hover:opacity-70 dark:text-blue-400"
          >
            Radix UI
          </a>{' '}
          color tokens, provided in an easy-to-use object format. All colors are
          represented in HEX values for seamless integration into your project.
        </p>
        <Button className="w-fit" asChild>
          <Link href={'/colors/custom'}>Create Custom Palette</Link>
        </Button>
      </div>
      {/* <Callout title="Note" className="text-left max-w-xl">
        We’ve slightly tweaked the Radix UI red, blue, and green scales by
        darkening step 9 and regenerating the palette, resulting in richer, less
        light base colors.
      </Callout> */}
      <div className="grid grid-cols-2 gap-5 max-w-6xl w-full md:flex md:flex-col md:gap-8">
        {filteredColors.map(([colorName, colorScale]) => {
          const colorNameAlpha = `${colorName}A` as keyof typeof colors;
          const colorScaleAlpha = colors[colorNameAlpha];
          return (
            <ColorPalettePreview
              key={colorName}
              colorName={colorName}
              colorScale={colorScale.map((c) => c.hex)}
              colorScaleAlpha={colorScaleAlpha.map((c) => c.hex)}
            />
          );
        })}
      </div>
    </main>
  );
}
