# data "aws_elasticache_replication_group" "session" {
#   replication_group_id = "${var.cluster_id}"
# }

data "aws_elasticache_cluster" "default" {
  cluster_id = "${var.cluster_id}"
}

# flsshygn-dev-session-store.tpqynz.0001.euc1.cache.amazonaws.com