
data "aws_iam_policy_document" "fhpredict" {
  statement {
    sid ="kwbfhpredict1"
    effect = "Allow"
    actions = ["s3:*"]
    resources = ["arn:aws:s3:::*"]
  }
}

resource "aws_iam_policy" "fhpredict" {
 name = "${var.user_name}s3-policy"
 policy = "${data.aws_iam_policy_document.fhpredict.json}"
}



resource "aws_iam_user" "fhpredict" {
  name = "${var.user_name}"
  force_destroy = true
  tags = {
    type = "terraform"
  }
}
resource "aws_iam_access_key" "fhpredict" {
  user    = "${aws_iam_user.fhpredict.name}"
}


resource "aws_iam_user_policy_attachment" "attach" {
 user = "${aws_iam_user.fhpredict.name}"
 policy_arn = "${aws_iam_policy.fhpredict.arn}"
}

# {
#     "Version": "2012-10-17",
#     "Statement": [
#         {
#             "Effect": "Allow",
#             "Action": "s3:*",
#             "Resource": "*"
#         }
#     ]
# }