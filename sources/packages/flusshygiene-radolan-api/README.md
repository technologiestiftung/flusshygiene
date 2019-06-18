# Radolan API Lambda

This is a Lambda function to access all the radolan data stored in an S3 Bucket.

## Bucket Public Access

```json
{
  "Id": "Policy1560848498952",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::flusshygiene-radolan-data/*",
      "Principal": {
        "AWS": [
          "*"
        ]
      }
    }
  ]
}
```
