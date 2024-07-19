output "backend_deployment_name" {
  description = "The name of the BE deployment"
  value       = kubernetes_deployment.backend.metadata[0].name
}

output "namespace" {
  description = "The namespace of the deployment"
  value       = kubernetes_deployment.backend.metadata[0].namespace
}
output "frontend_deployment_name" {
  description = "The name of the FE deployment"
  value       = kubernetes_deployment.frontend.metadata[0].name
}
