export const createLinks: (text: string | null) => string = (text) => {
  if (text === null) {
    return '';
  }
  const res = text.replace(
    /<(.*?)>/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"><em>[Link]</em></a>',
  );
  // console.log(text, res);

  return res;
};
