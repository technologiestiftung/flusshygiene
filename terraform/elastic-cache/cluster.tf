resource "aws_elasticache_cluster" "default" {
  cluster_id           = "${var.namespace}-${var.env}-${var.name}"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis5.0"
  engine_version       = "5.0.5"
  port                 = 6379
  maintenance_window   = "wed:00:00-wed:01:00"
  subnet_group_name    = "${aws_elasticache_subnet_group.default.name}"
  apply_immediately    = true
  security_group_ids = ["${aws_security_group.redis.id}"]
}
