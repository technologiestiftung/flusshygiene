resource "aws_s3_bucket" "uploads" {
  bucket        = "${var.prefix}-bwb-uploads-${var.env}"
  acl           = "public-read"
  force_destroy = true
  versioning {
    enabled = false
  }

  # Should be added for production
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"] # "${var.allowed_origins}"

    expose_headers  = ["ETag"]
    max_age_seconds = 6000
  }

  tags = {
    name    = "terraform bucket for uploads from bwb"
    project = "flsshygn"
    type    = "storage"
  }

}

# resource "aws_s3_bucket" "radolan" {
#   bucket        = "${var.prefix}-radolan-recent-${var.env}"
#   acl           = "public-read"
#   force_destroy = true
#   versioning {
#     enabled = false
#   }

# # Should be added for production
#   cors_rule {
#     allowed_headers = ["*"]
#     allowed_methods = ["PUT", "POST", "GET"]
#     allowed_origins =  "${var.allowed_origins}"
#     expose_headers  = ["ETag"]
#     max_age_seconds = 6000
#   }

#   tags = {
#     name    = "terraform bucket for uploads from radolan recent module"
#     project = "flsshygn"
#     type    = "storage"
#   }

# }
