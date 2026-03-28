import Link from 'next/link';

export async function ComponentsList() {
  const registry = await import('@/public/r/registry.json');

  const components = registry.items.filter(
    (item) => item.type === 'registry:ui',
  );

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
      {components.map((item) => (
        <li key={item.name}>
          <Link
            href={`/docs/components/${item.name}`}
            className="capitalize no-underline hover:underline"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
