# EB Terraform Source

Depends on:

before

- create users
- deployer
- fhpredict s3 user
- s3 for upload
- elasticache
- rds
- default security group
- default vpc
- ssl cert created in acm and get arn

after

- domain provider set CNAME record https://colintoh.com/blog/map-custom-domain-to-elastic-beanstalk-application
- create listner
- 
