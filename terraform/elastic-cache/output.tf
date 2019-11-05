output "cache_nodes" {
  value = "${aws_elasticache_cluster.default.cache_nodes.0.address}"
}
output "security_group_ids" {
  value = "${aws_elasticache_cluster.default.security_group_ids}"
}


output "cluster_id" {
  value = "${aws_elasticache_cluster.default.cluster_id}"
}
