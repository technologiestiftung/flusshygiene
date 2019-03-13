export const isObject = (obj: any)=> {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};
