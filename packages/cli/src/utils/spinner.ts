import yoctoSpinner, { type Options } from 'yocto-spinner';

export function spinner(
  text: Options['text'],
  options?: Omit<Options, 'text'> & {
    silent?: boolean;
  },
) {
  if (options?.silent) {
    return null;
  }

  return yoctoSpinner({
    text,
    color: 'cyan',
    ...options,
  });
}
