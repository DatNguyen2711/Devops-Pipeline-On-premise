## Running Application with Helm

Step 1: Install Helm on your cluster

```bash
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

Step 2: Install helm chart

```bash
helm install -f {your_app_name} value-app-demo.yaml

```

Step 3: Check your results

```bash
kubectl get all -n helm-test
```
