output "public-dns" {
  value = "${aws_instance.worker.public_dns}"
}
