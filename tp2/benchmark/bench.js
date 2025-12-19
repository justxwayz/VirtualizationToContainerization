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

    console.log(`Success: ${success}`);
    console.log(`Errors: ${errors}`);
    console.log(`Total time: ${duration}s`);
    console.log(`Req/sec: ${(TOTAL_REQUESTS / duration).toFixed(2)}`);
}

runBenchmark();
