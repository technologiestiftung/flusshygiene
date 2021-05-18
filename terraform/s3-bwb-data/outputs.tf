output "s3-bucket-name-upload" {
  value = "${aws_s3_bucket.uploads.bucket_domain_name}"
}
