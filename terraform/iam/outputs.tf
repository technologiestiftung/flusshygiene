# outputs.tf
output "user_arn" {
 value = "${aws_iam_user.fhpredict.arn}"
}

output "user_name" {
  value = "${aws_iam_user.fhpredict.name}"
}
output "user_unique_id" {
  value = "${aws_iam_user.fhpredict.unique_id}"
}

output "user_access_id" {
value = "${aws_iam_access_key.fhpredict.id}"
}
output "user_secret" {
  value = "${aws_iam_access_key.fhpredict.secret}"
}