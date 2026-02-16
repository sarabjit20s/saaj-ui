import { detect } from 'package-manager-detector/detect';

export async function getPackageManager() {
  const pm = await detect();

  return pm?.name ?? 'npm';
}
