export const createLinks: (text: string | null) => string = (text) => {
  if (text === null) {
    return "";
  }
  const res = text.replace(
    /<(.*?)>/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"><em>[Link]</em></a>',
  );
  // console.log(text, res);

  return res;
};

export const createPDFLinks: (text: string | null) => string = (text) => {
  if (text === null) {
    return "";
  }
  const res = text.replace(/<(.*?)>/g, '<Link src="$1">[Link]</Link>');
  // console.log(text, res);

  return res;
};
