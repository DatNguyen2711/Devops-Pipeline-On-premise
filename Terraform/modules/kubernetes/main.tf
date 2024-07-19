resource "kubernetes_secret" "dockerhub" {
  metadata {
    name      = var.deployment_config_backend.image_pull_secret_name
    namespace = var.deployment_config_backend.namespace
  }

  data = {
    ".dockerconfigjson" = base64encode(jsonencode({
      "auths" = {
        "https://index.docker.io/v1/" = {
          "username" = "datnd2711"
          "password" = "234555axy"
          "email"    = "datlaid@gmail.com"
          "auth"     = base64encode("datnd2711:234555axy")
        }
      }
    }))
  }

  type = "kubernetes.io/dockerconfigjson"
}

resource "kubernetes_deployment" "backend" {
  metadata {
    name      = var.deployment_config_backend.name
    namespace = var.deployment_config_backend.namespace
    labels = {
      component = var.deployment_config_backend.component
    }
  }

  spec {
    replicas = var.deployment_config_backend.replicas

    selector {
      match_labels = {
        component = var.deployment_config_backend.component
      }
    }

    template {
      metadata {
        labels = {
          component = var.deployment_config_backend.component
        }
      }

      spec {
        container {
          name  = var.deployment_config_backend.container_name
          image = var.deployment_config_backend.image
          port {
            container_port = var.deployment_config_backend.container_port
            name           = var.deployment_config_backend.port_name
          }
          resources {
            requests = {
              cpu    = var.deployment_config_backend.resources.requests.cpu
              memory = var.deployment_config_backend.resources.requests.memory
            }
            limits = {
              cpu    = var.deployment_config_backend.resources.limits.cpu
              memory = var.deployment_config_backend.resources.limits.memory
            }
          }
        }

        image_pull_secrets {
          name = kubernetes_secret.dockerhub.metadata[0].name
        }
      }
    }
  }
}
