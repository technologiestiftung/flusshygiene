source(".Rprofile")
library(httr)
readRenviron(".env")
AUTH0_CLIENT_ID = Sys.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET= Sys.getenv("AUTH0_CLIENT_SECRET")
AUTH0_AUDIENCE = Sys.getenv("AUTH0_AUDIENCE")
AUTH0_REQ_URL = Sys.getenv("AUTH0_REQ_URL")
API_URL = Sys.getenv("API_URL")
body = sprintf('{"client_id":"%s",
                "client_secret": "%s",
                "audience":"%s",
                "grant_type":"client_credentials"}', AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE)


# print(body)
#
#  When your token expires you can do this request
# response <- POST(AUTH0_REQ_URL, body = body, encode = "json", add_headers("content-type" = "application/json"))
# print(status_code(response)) # should be 200
# tokenData = content(response)
# print(tokenData$access_token)
# print(tokenData$token_type)


fileName <- './.token'
token <- readChar(fileName, file.info(fileName)$size)
print(token)

res <- GET(API_URL, add_headers("Authorization" = paste("Bearer", token, sep = " ")))
status_code(res) # 200
headers(res)
str(content(res, "parsed"))
