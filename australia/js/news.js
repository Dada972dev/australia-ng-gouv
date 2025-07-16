async function fetchArticles() {
    try {
        const response = await fetch('articles.html'); // Fetch the articles HTML page
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const articles = Array.from(doc.querySelectorAll('.article-item')).slice(0, 3); // Get the first 3 articles
        console.log('Fetched articles:', articles); // Log the fetched articles
        return articles.map(article => ({
            title: article.querySelector('h2').textContent,
            description: article.querySelector('p').textContent,
            link: article.querySelector('a').href,
            image: article.querySelector('img').src
        }));
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

function displayNews(news) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ''; // Clear any existing content
    news.forEach(item => {
        const newsElement = document.createElement('div');
        newsElement.classList.add('news-item');
        newsElement.innerHTML = `
            <img src="${item.image}" alt="Image de l'article">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${item.link}">Lire la suite</a>
        `;
        newsList.appendChild(newsElement);
    });
    console.log('Displayed news:', news); // Log the displayed news
}

document.addEventListener('DOMContentLoaded', async () => {
    const news = await fetchArticles();
    displayNews(news);
});