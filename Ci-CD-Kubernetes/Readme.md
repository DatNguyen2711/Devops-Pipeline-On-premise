## CICD for cluster using Jenkins and Helm

### When you merge your branch into master branch trigger will start the pipeline

### This is a pipeline for Monorepo
Step 1: Install Helm on your Jenkins's server

```bash
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

Step 2: Configure webhooks for jenkins agent in gitlab

```bash
http://admin:113ce58db5e81ab320567e35ddb9402e7e@jenkins.datlaid.tech:8080/project/app-demo/cicd-k8s-demo

    format : root account + jenkins token @ jenkins url + "projects" + folder's name(if exists) + project's name  

```
![alt text](image-4.png)

Step 3: Configure build triggers for jenkins agent

```bash
kubectl get all -n helm-test
```


![alt text](image-1.png)
![alt text](image-5.png)
Step 4: copy config file of your cluster into jenkins server then copy config file to jenkins user

Step 5: Configure credentials of jenkins and dockerhub
![alt text](image-2.png)

Step 6: Install docker plugins for pipeline
![alt text](image-3.png)

Step 7: Install docker for jenkins server