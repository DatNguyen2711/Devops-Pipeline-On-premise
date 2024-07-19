module "k8s" {
  source = "./modules/kubernetes"

  deployment_config_frontend = var.deployment_config_frontend

  deployment_config_backend = var.deployment_config_backend
}

