# Compte rendu - TP 1

## TP1 Part 1

---

## 1. Une ptite db MySQL

### Lancez un conteneur mysql en version 8.4

```bash
  docker run --name mysql mysql:8.4
```
* image mysql success
```info
2025-12-15 10:49:26+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
```

### Vérifier que le conteneur est actif

```bash
  docker ps -a
```

* images listing success
```info
  CONTAINER ID   IMAGE                 COMMAND                   CREATED         STATUS                     PORTS     NAMES
  b2329f890929   mysql:8.4             "docker-entrypoint.s…"    4 seconds ago   Exited (1) 2 seconds ago             mysql
```

### Consulter les logs du conteneur

```bash
  docker logs mysql  
```

* logs success
```info
2025-12-15 10:49:26+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
2025-12-15 10:49:26+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
2025-12-15 10:49:26+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
2025-12-15 10:49:27+00:00 [ERROR] [Entrypoint]: Database is uninitialized and password option is not specified
    You need to specify one of the following as an environment variable:
    - MYSQL_ROOT_PASSWORD
    - MYSQL_ALLOW_EMPTY_PASSWORD
    - MYSQL_RANDOM_ROOT_PASSWORD
```

### Supprimer le conteneur inactif

```bash
    docker rm mysql
```

```tip
run: docker ps -a
    
then remove the image wanted.
```

* remove mysql image success
```info
  - first run, docker rm mysql: 
    mysql

  - then run, docker ps -a:
    image been removed, you can see it because the image removed is unseen on the list
```

### Lancer un nouveau conteneur MySQL

```bash
  docker run --name mysql -e MYSQL_ROOT_PASSWORD=root mysql:8.4 
```

* image mysql started success
```info 
2025-12-15 10:51:10+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
```

```bash
  docker ps -a
```

* image mysql started on list success
```info 
CONTAINER ID   IMAGE                 COMMAND                   CREATED         STATUS                      PORTS                 NAMES
d53afccfd88a   mysql:8.4             "docker-entrypoint.s…"    6 minutes ago   Up 6 minutes                3306/tcp, 33060/tcp   mysql
```

---

## 2. Un PMA pour accompagner la DB

### Lancer un conteneur PHPMyAdmin

```bash
  docker run --name phpmyadmin -d --link mysql:db -p 8080:80 phpmyadmin
```

* image phpmyadmin started on list success
```info
CONTAINER ID   IMAGE                 COMMAND                   CREATED          STATUS                      PORTS                                     NAMES
0f8cc5ba93c7   phpmyadmin            "/docker-entrypoint.…"    5 seconds ago    Up 4 seconds                0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   phpmyadmin
```

### Visitez l'interface web de PHPMyAdmin

```bash
  curl http://localhost:8080
```

* curl to localhost phpmyadmin success
```info
  StatusCode        : 200
  RawContent        : HTTP/1.1 200 OK
```

---

## 3. Compose

### Créer un fichier compose.yml

* compose.yml created
```info
new directory compose/
new file compose/compose.yml
```

* compose.yml content
```info
services:
  db:
    image: <IMAGE_MYSQL>
    environment:
      - MYSQL_ROOT_PASSWORD=<TON_PASSWORD>

  pma:
    image: phpmyadmin
    ports:
      - "8080:80"
```

### Remplacer par les bonnes valeurs

* compose.yml new content added
```info
services:
  db:
    image: mysql:8.4
    environment:
      - MYSQL_ROOT_PASSWORD=root

  pma:
    image: phpmyadmin
    ports:
      - "8080:80"
```

### Lancer la stack compose

```bash
  docker compose up
```

* run compose.yml success
```info
[+] Running 3/3
 ✔ Network compose_default  Created  0.0s 
 ✔ Container compose-pma-1  Created  0.1s 
 ✔ Container compose-db-1   Created
```

```bash
  docker ps -a
```

* run all images checked
```info
CONTAINER ID   IMAGE                 COMMAND                   CREATED             STATUS                          PORTS                                     NAMES
2dec72d5bc1a   phpmyadmin            "/docker-entrypoint.…"    4 minutes ago       Up 14 seconds                   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   compose-pma-1
a4bd6c620e47   mysql:8.4             "docker-entrypoint.s…"    4 minutes ago       Up 14 seconds                   3306/tcp, 33060/tcp                       compose-db-1
```

### Visitez l'interface Web de PHPMyAdmin

```bash
  curl http://localhost:8080
```

* curl to localhost phpmyadmin success
```info
curl to localhost phpmyadmin success
RawContent        : HTTP/1.1 200 OK
```

---

## 4. Donnée persistantes

### Ajouter la gestion d'un volume à votre compose.yml

* compose.yml new content added
```info
services:
  db:
    image: mysql:8.4
    environment:
      - MYSQL_ROOT_PASSWORD=root
    volumes:
      - db_data:/var/lib/mysql

  pma:
    image: phpmyadmin
    ports:
      - "8080:80"

volumes:
  db_data:
```

### Prouver que le volume est bien utilisé

```bash
  docker compose up
```

* run compose.yml success
```info
[+] Running 2/2
 ✔ Volume "compose_db_data"  Created                                                                                                                                           0.0s 
 ✔ Container compose-db-1    Recreated 
```

* compose_db_data created
```info
DRIVER    VOLUME NAME
local     compose_db_data
```

---

## 5. Changing database easily

### Proposer un nouveau compose.yml

* compose.yml new content with postgres and adminer added
```info
services:
  db:
    image: postgres
    environment:
      - POSTGRES_PASSWORD=root
    volumes:
      - db_data:/var/lib/mysql

  pma:
    image: adminer
    ports:
      - "8080:80"

volumes:
  db_data:
```

### Prouver que ça run !

```bash
  docker ps
```

* compose success
```info
CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS         PORTS                                     NAMES
98fd60497d1c   postgres   "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   5432/tcp                                  compose-db-1
e5d5ed1be5ff   adminer    "entrypoint.sh docke…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   compose-pma-1
```

---
