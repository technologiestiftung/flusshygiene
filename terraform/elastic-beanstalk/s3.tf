data "aws_s3_bucket" "upload" {
  bucket = "${var.upload_bucket}"
}