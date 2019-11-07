output "lb_name" {
  value = "${data.aws_lb.default.name}"
}

output "lb_listener_80" {
  value = "${data.aws_lb_listener.default80}"
}

# output "cache_nodes" {
#   value = "${aws_elasticache_cluster.default.cache_nodes.0.address}"
# }
# output "security_group_ids" {
#   value = "${aws_elasticache_cluster.default.security_group_ids}"
# }


# output "cluster_id" {
#   value = "${aws_elasticache_cluster.default.cluster_id}"
# }
