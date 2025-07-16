const API_KEY = 'AIzaSyCFkphp1I5nAo4fxYzYI2J2ukzZnDFb_GQ'; // Replace with your actual API key
const CHANNEL_ID = 'UCSeFN49CauVkCa2hr5bbp-w'; // Replace with the actual channel ID

async function fetchVideos(maxResults) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
}

function displayVideos(videos, elementId) {
    const videoList = document.getElementById(elementId);
    videoList.innerHTML = ''; // Clear any existing content
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video-item');
        if (document.body.classList.contains('dark-mode')) {
            videoElement.classList.add('dark-mode');
        }
        videoElement.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
                <h3>${video.snippet.title}</h3>
                <p>${video.snippet.description}</p>
            </a>
        `;
        videoList.appendChild(videoElement);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('video-list')) {
        const videos = await fetchVideos(50); // Fetch 50 videos for videos.html
        displayVideos(videos, 'video-list');
    }
    if (document.getElementById('latest-videos-list')) {
        const latestVideos = await fetchVideos(3); // Fetch 3 videos for index.html
        displayVideos(latestVideos, 'latest-videos-list');
    }
});