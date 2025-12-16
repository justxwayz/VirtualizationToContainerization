# Compte rendu - TP 1

## TP1 Part 2

---

## 2. Dockerfile

### Ajoutez un fichier part2/1/Dockerfile

* package.json, app.js and Dockerfile content added

```info
- first add, package.json and app.js files 

- second insert, content from gitlab depot

- then, add Dockerfile
```

### Construire l'image shitty_app à partir de ce Dockerfile

```bash
  docker build -t shitty_app:1.0 .
```

* shitty_app image added success
```info
REPOSITORY              TAG         IMAGE ID       CREATED          SIZE
shitty_app              1.0         acdcbe284afd   36 seconds ago   1.65GB
```

### Lancer l'application avec une commande docker run

```bash
  docker run -d -p 3000:3000 --name shitty_app shitty_app:1.0
```

### Prouvez que ça tourne

```bash
  docker ps
```

* run image success
```info
CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS          PORTS                                         NAMES
ce88393e68f4   shitty_app:1.0   "docker-entrypoint.s…"   27 seconds ago   Up 26 seconds   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   shitty_app
```

```bash
  docker logs
```

* show image logs success
```info
> Shitty webapp for B3 Dev TP1@1.0.0 dev
> nodemon src/app.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000
```

```bash
  curl http://localhost:3000
```

* curl success
```info
StatusCode        : 200
RawContent        : HTTP/1.1 200 OK
```

---

## 3. Hot reload pleaaaase

### Lancer un nouveau conteneur à partir de l'image shitty_app

```bash
  docker run --name shitty_app -p 3000:3000 -d -v ".\src:/app/src" shitty_app
```

```bash
  docker ps
```

```info
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                         NAMES
220c756ede69   shitty_app:1.0   "docker-entrypoint.s…"   4 seconds ago   Up 4 seconds   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   shitty_app
```

```tip
 To do: hot reload on windows need package.json modified : 
    "scripts": { 
        "dev": 
    from    "nodemon src/app.js" 
    to      "nodemon --legacy-watch src/app.js" 
    },
```

### Vérifier que ça fonctionne

```bash
  docker logs -f shitty_app
```

```info
> Shitty webapp for B3 Dev TP1@1.0.0 dev
> nodemon --legacy-watch src/app.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000
[nodemon] restarting due to changes...
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000
```

---

## 4. Compose please

### Transformer ce docker run en compose.yml

```info
services:
  app:
    image: shitty_app:1.0
    container_name: app
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
```

```bash
  docker compose up
``` 

* run compose success
```info
[+] Running 2/2
 ✔ Network 1_default  Created                                                                                                                                                  0.0s 
 ✔ Container app      Created 
 
app  | [nodemon] starting `node src/app.js`                                                                                                                                         
app  | Server running at http://localhost:3000                                                                                                                                      
app  | [nodemon] restarting due to changes...
app  | [nodemon] starting `node src/app.js`
app  | Server running at http://localhost:3000
```

---

## 5. DB please

### Créer un Dockerfile

* package.json, app.js and Dockerfile content added

```info
- first add, package.json and app.js files 

- second insert, content from gitlab depot

- then, add Dockerfile
```

### Créer un compose.yml



### Allumer la stack et prouver que ça fonctionne



### Mettre en place des données persistentes pour la db



---

