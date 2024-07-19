resource "kubernetes_secret" "dockerhub" {
  metadata {
    name      = var.imnage_pull_secret.name
    namespace = var.namespace.name
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

resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = var.deployment_config_frontend.name
    namespace = var.deployment_config_frontend.namespace
    labels = {
      component = var.deployment_config_frontend.component
    }
  }

  spec {
    replicas = var.deployment_config_frontend.replicas

    selector {
      match_labels = {
        component = var.deployment_config_frontend.component
      }
    }

    template {
      metadata {
        labels = {
          component = var.deployment_config_frontend.component
        }
      }

      spec {
        container {
          name  = var.deployment_config_frontend.container_name
          image = var.deployment_config_frontend.image
          port {
            container_port = var.deployment_config_frontend.container_port
            name           = var.deployment_config_frontend.port_name
          }
          resources {
            requests = {
              cpu    = var.deployment_config_frontend.resources.requests.cpu
              memory = var.deployment_config_frontend.resources.requests.memory
            }
            limits = {
              cpu    = var.deployment_config_frontend.resources.limits.cpu
              memory = var.deployment_config_frontend.resources.limits.memory
            }
          }
          liveness_probe {
            http_get {
              path = var.deployment_config_frontend.liveness_probe.path
              port = var.deployment_config_frontend.liveness_probe.port
            }
            initial_delay_seconds = var.deployment_config_frontend.liveness_probe.initial_delay_seconds
            period_seconds        = var.deployment_config_frontend.liveness_probe.period_seconds
            failure_threshold     = var.deployment_config_frontend.liveness_probe.failure_threshold
          }
          readiness_probe {
            http_get {
              path = var.deployment_config_frontend.readiness_probe.path
              port = var.deployment_config_frontend.readiness_probe.port
            }
            initial_delay_seconds = var.deployment_config_frontend.readiness_probe.initial_delay_seconds
            period_seconds        = var.deployment_config_frontend.readiness_probe.period_seconds
            failure_threshold     = var.deployment_config_frontend.readiness_probe.failure_threshold
          }
        }

        image_pull_secrets {
          name = kubernetes_secret.dockerhub.metadata[0].name
        }
      }
    }
  }
}
