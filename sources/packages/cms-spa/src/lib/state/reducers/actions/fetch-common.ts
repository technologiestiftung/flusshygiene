export const handleErrors = (response: Response) => {
  // console.log(response);

  // response.json().then((json) => {
  //   console.log(json);
  // });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};
