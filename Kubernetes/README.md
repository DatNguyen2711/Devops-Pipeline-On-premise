## Running application on K8S cluster

### Tech using

*VMWare*

*MetalLB*

*Ingress Controller*

Step 1: First, config the ConnectionStrings at back-end

```bash
    "ConnectionStrings": {
      "MyDb": "Server=sqlserver.pharmacy-app.svc.cluster.local,1433; Database=MedicineWeb; User Id=sa; Password=DatLaid234555@Xy; MultipleActiveResultSets=true; TrustServerCertificate=True"
  },
```

And also edit the context file ProjectPrn231Context.cs

```bash

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=sqlserver.pharmacy-app.svc.cluster.local,1433; Database=MedicineWeb; User Id=sa; Password=DatLaid234555@Xy; MultipleActiveResultSets=true; TrustServerCertificate=True");


```

Step 2: Build image for back-end

```bash
cd Medicine-Web

docker build -t be:v1 .

docker tag be:v1 datnd2711/pharmacy-be:tagname

docker push datnd2711/pharmacy-be:tagname

```

Step 3: Build image for front-end

Config the .env

```bash


```

```bash
docker build -t fe:v1 .

docker tag fe:v1 datnd2711/pharmacy-fe:{tag_name}

docker push datnd2711/pharmacy-fe:{tag_name}
```

Step 4: build image cho Database

```bash
cd Database

docker build -t db:{tag_name} -f Dockerfile.Database .

docker tag db:{tag_name} datnd2711/sqlserver:{tagname}

docker push  datnd2711/sqlserver:{tagname}

```
Step 5: Run Application on K8S cluster
```bash

kubectl create namespace pharmacy-app


git clone ...

cd {path_to_repo}/Kubernetes

kubectl apply -f .
```
