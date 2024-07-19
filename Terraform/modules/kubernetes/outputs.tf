output "backend_deployment_name" {
  description = "The name of the deployment"
  value       = kubernetes_deployment.backend.metadata[0].name
}

output "namespace" {
  description = "The namespace of the deployment"
  value       = kubernetes_deployment.backend.metadata[0].namespace
}
