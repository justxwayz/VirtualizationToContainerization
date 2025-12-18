const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

// Web UI
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>MyLibrary</title>
                <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@2/css/pico.min.css">
                <style>
                    #list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
                    .card { width: 250px; height: 500px; display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                    .card img { width: 100%; height: 180px; object-fit: cover; display: block; }
                    .card-body { flex: 1; padding: 0.75rem; display: flex; flex-direction: column; justify-content: space-between; }
                    .badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
                    .badge { padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 999px; background: #eaeaea; }
                    .badge.green { background: #d1fae5; color: #065f46; }
                    .badge.blue { background: #dbeafe; color: #1e3a8a; }
                    .card-actions { display: flex; flex-direction: column; gap: 0.25rem; }
                </style>
            </head>
            <body class="container">
                <header>
                    <nav><ul><li><strong>MyLibrary</strong></li></ul></nav>
                </header>
                <main>
                    <h2>Mes œuvres</h2>
                    <form id="addForm">
                        <input type="text" name="title" placeholder="Nom de l'œuvre" required>
                        <input type="url" name="link" placeholder="Lien">
                        <select name="readingStatus"><option value="A lire">A lire</option><option value="Lu">Lu</option></select>
                        <select name="chapterStatus"><option value="En cours">En cours</option><option value="Terminé">Terminé</option></select>
                        <button type="submit">Ajouter</button>
                    </form>
                    <hr>
                    <div id="list"></div>
                </main>
                <footer>
                    <hr>
                    <p>© 2025 Waylo Inc.</p>
                </footer>
                <script>
                    const API_URL = 'http://localhost:3000/api/works';
                    
                    async function loadLibrary() {
                      const res = await fetch(API_URL);
                      const data = await res.json();
                      const list = document.getElementById('list');
                      list.innerHTML = '';
                    
                      data.forEach(work => {
                        const article = document.createElement('article');
                        article.className = 'card';
                        article.innerHTML = \`
                          <img src="https://placehold.co/400x200" alt="cover">
                          <div class="card-body">
                            <div>
                              <h4>\${work.title}</h4>
                              <div class="badges">
                                <span class="badge blue">\${work.readingStatus}</span>
                                <span class="badge green">\${work.chapterStatus}</span>
                              </div>
                            </div>
                            <div class="card-actions">
                              <button class="secondary" onclick="deleteWork(\${work.id})">Supprimer</button>
                            </div>
                          </div>
                        \`;
                        list.appendChild(article);
                      });
                    }
                    
                    async function deleteWork(id) {
                      await fetch(\`\${API_URL}/\${id}\`, { method: 'DELETE' });
                      loadLibrary();
                    }
                    
                    document.getElementById('addForm').addEventListener('submit', async e => {
                      e.preventDefault();
                      const form = e.target;
                      await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          title: form.title.value,
                          link: form.link.value,
                          readingStatus: form.readingStatus.value,
                          chapterStatus: form.chapterStatus.value
                        })
                      });
                      form.reset();
                      loadLibrary();
                    });
                    
                    loadLibrary();
                </script>
            </body>
        </html>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Front Web running on http://localhost:${PORT}`);
});
