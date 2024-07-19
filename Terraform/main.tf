module "k8s" {
  source = "./modules/kubernetes"

  deployment_config = var.deployment_config
}
