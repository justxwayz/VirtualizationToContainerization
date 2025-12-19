# Compte rendu - TP 2

---

## Part 1 : Package your little thingie

## 2. Marche à suivre

### Le but est donc de packager votre app avec Docker

```info
FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY ./src ./src

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

## Part 2 : Préoccupé par l'environnement

## 1. Modification de l'app

### Modifier le code de votre app

```info
DB_HOST=db
DB_PORT=3306
DB_USER=mylibrary
DB_NAME=mylibrary_db
DB_PASSWORD=mylib
APP_PORT=3000
```

## 2. Adapter le compose.yml

### Adapter le compose.yml de votre dépôt

```info
services:
  back:
    build:
      context: ./back
      dockerfile: Dockerfile
    container_name: mylibrary_back
    ports:
      - "3000:3000"
    volumes:
      - ./back/src:/app/src
    env_file:
      - ./back/.env
    depends_on:
      - db

  front:
    build: ./front
    container_name: mylibrary_front
    ports:
      - "127.0.0.1:8000:8000"
    volumes:
      - ./front/src:/app/src
    env_file:
      - ./front/.env
    depends_on:
      - back

  db:
    image: mysql:8.4
    container_name: mylibrary_db
    volumes:
      - ./db/data:/var/lib/mysql
    env_file:
      - ./db/.env
```

### Gérer un ou plusieurs

* /back/.env

```info
DB_HOST=db
DB_PORT=3306
DB_USER=mylibrary
DB_NAME=mylibrary_db
DB_PASSWORD=mylib
APP_PORT=3000
```

* /front/.env

```info
APP_PORT=8000
BACK_HOST=back
BACK_PORT=3000
```

* /db/.env

```info
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: mylibrary_db
MYSQL_USER: mylibrary
MYSQL_PASSWORD: mylib
```

### Bah, setup ça du coup

* .gitignore update

```info
.DS_Store
Thumbs.db
*.swp
*.swo
*.log
.env
.env.*
*.key
*.pem
docker-data/
docker-volumes/
volumes/
docker-compose.override.yml
docker-compose.local.yml
.vagrant/
*.box
node_modules/
dist/
build/
target/
.cache/
.vscode/
.idea/
*.iml
tmp/
temp/
db/data/
```

---

## Part 3 : Une attention à l'image de base 

## 2. Version Alpine du Dockerfile

* Dockerfile-alpine (DEFAULT)

```info
 FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY ./src ./src

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "dev"]
```

* Dockerfile-debian

```info
FROM node:20-bullseye

WORKDIR /app

COPY package.json .

RUN npm install

COPY ./src ./src

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "dev"]
```

## 3. Benchmark this shiet

### Ecrire un script qui tabasse

```bash
  node .\benchmark\bench.js
```

* benchmark/bench.js

```info
const http = require('http');

const TARGET_URL = 'http://localhost:3000/api/works';
const TOTAL_REQUESTS = 2000;
const CONCURRENCY = 100;

let success = 0;
let errors = 0;

function sendRequest() {
    return new Promise((resolve) => {
        const req = http.get(TARGET_URL, (res) => {
            if (res.statusCode === 200) success++;
            else errors++;

            res.resume();
            resolve();
        });

        req.on('error', () => {
            errors++;
            resolve();
        });
    });
}

async function runBenchmark() {
    console.log(`Benchmark started`);
    console.log(`Target: ${TARGET_URL}`);
    console.log(`Requests: ${TOTAL_REQUESTS}`);
    console.log(`Concurrency: ${CONCURRENCY}`);
    console.log('--------------------------------');

    const start = Date.now();

    let queue = [];
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        queue.push(sendRequest());

        if (queue.length === CONCURRENCY) {
            await Promise.all(queue);
            queue = [];
        }
    }

    if (queue.length) {
        await Promise.all(queue);
    }

    const duration = (Date.now() - start) / 1000;

    console.log('--------------------------------');
    console.log(`Success: ${success}`);
    console.log(`Errors: ${errors}`);
    console.log(`Total time: ${duration}s`);
    console.log(`Req/sec: ${(TOTAL_REQUESTS / duration).toFixed(2)}`);
}

runBenchmark();
```

* logs (Dockerfile-alpine)

```info
Requests: 2000

Success: 2000
Errors: 0
Total time: 0.825s
Req/sec: 2424.24
```

### Ajouter un peu de logging dans votre app 

* first build app

```bash
  docker compose up --build
```

* second run logs

```bash
  docker logs -f mylibrary_back
```

* then run bench.js

```bash
  node .\benchmark\bench.js
```

```info
[2025-12-19T20:28:41.067Z] ➡️  GET /api/works reçue
[2025-12-19T20:28:41.077Z] ⬅️  GET /api/works traitée | status=200 | time=10ms | total_requests=1
...
[2025-12-19T20:28:42.719Z] ➡️  GET /api/works reçue
[2025-12-19T20:28:42.719Z] ⬅️  GET /api/works traitée | status=200 | time=0ms | total_requests=2000
```

### HIT IT HARD

* benchmark Dockerfile (alpine DEFAULT)

```info
Benchmark started
Target: http://localhost:3000/api/works
Requests: 2000
Concurrency: 100
--------------------------------
Success: 2000
Errors: 0
Total time: 1.654s
Req/sec: 1209.19
benchmark: 1.655s
```

* benchmark Dockerfile-debian - BETTER (by a second)

```info
Benchmark started
Target: http://localhost:3000/api/works
Requests: 2000
Concurrency: 100
--------------------------------
Success: 2000
Errors: 0
Total time: 1.566s
Req/sec: 1277.14
benchmark: 1.567s
```

---

## Part 4 Bonus : Améliorer ton image

## 1. Clean caches

### Modifiez le Dockerfile

## 2. Labels

### Ajoutez des directives LABEL à votre Dockerfile qui précisent, avec les LABELs standards :

## 3. No root

### Ajoutez un utilisateur applicatif à votre Dockerfile

---