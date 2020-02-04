export enum ERRORS {
  badRequest400 = 'Bad request',
  badRequest404 = 'Bad request. Resource does not exists but might in the future',
  badRequestMissingOrWrongID404 = 'Bad request. The id is missing or does not exist',
  badRequestDuplicateValuesID409 = 'Bad request. There are duplicate values in your data',
  badRequestCantDeletePublicData404 = 'Can not delete public bathingspots. Missing force flag',
  badRequestCantDeleteRegionWithSpots404 = 'Can not delete region with bathingspots.',
  badRequestUserNotAuthorized = 'Sorry. You are not authorized for this action',
}
