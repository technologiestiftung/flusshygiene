
export enum ERRORS {
  badRequest400 = 'Bad request',
  badRequest404 = 'Bad request. Resource does not exists but might in the future',
  badRequestMissingOrWrongID404 = 'Bad request. The id is missing or does not exist',
  badRequestCantDeletePublicData404 = 'Can\'t delete public bathingspots. Missing force flag'

};
