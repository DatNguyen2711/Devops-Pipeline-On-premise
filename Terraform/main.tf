module "k8s" {
  source             = "./modules/kubernetes"
  statefulset_config = var.sqlserver_statefulset_config
}

