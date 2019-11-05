
output "s3-bucket-name-radolan" {
  value = "${aws_s3_bucket.radolan.bucket_domain_name}"
}
