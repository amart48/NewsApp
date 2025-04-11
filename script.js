// Your API key for accessing the NewsAPI
const apikey = "92dbfafef9824603b61e8ff651bd9610";

// DOM elements for blog container, search field, and search button
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Function to fetch top headlines from the NewsAPI
async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apikey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.articles || []; // Return articles from the response or an empty array
    } catch (error) {
        console.error("Error fetching random news", error);
        return []; // Return an empty array in case of error
    }
}

// Function to fetch news based on a search query from the NewsAPI
async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apikey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.articles || []; // Return articles from the response or an empty array
    } catch (error) {
        console.error("Error fetching news by query", error);
        return []; // Return an empty array in case of error
    }
}

// Function to display the news articles on the web page
function displayBlogs(articles) {
    blogContainer.innerHTML = ""; // Clear any existing content in the blog container

    if (!Array.isArray(articles) || articles.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No articles available.";
        blogContainer.appendChild(message);
        return;
    }

    // Iterate through each article and create a blog card
    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || "placeholder-image-url.jpg"; // Set the image source or placeholder
        img.alt = article.title; // Set the image alt text

        const title = document.createElement("h2");
        const truncatedTitle =
            article.title.length > 30
                ? article.title.slice(0, 30) + "..." // Truncate the title if it's too long
                : article.title;
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDes =
            article.description && article.description.length > 120 // Check if description exists before truncating
                ? article.description.slice(0, 120) + "..." // Truncate the description if it's too long
                : article.description || "No description available."; // Handle case where description is null or empty
        description.textContent = truncatedDes;

        // Append image, title, and description to the blog card
        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);

        // Add click event to open the full article in a new tab
        blogCard.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        // Append the blog card to the blog container
        blogContainer.appendChild(blogCard);
    });
}

// Event listener for the search button click event
searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim(); // Get the trimmed search query
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query); // Fetch news based on the query
            displayBlogs(articles); // Display the fetched articles
        } catch (error) {
            console.log("Error fetching news by query", error);
        }
    }
});

// Immediately invoked function to fetch and display random news articles on page load
(async () => {
    try {
        const articles = await fetchRandomNews(); // Fetch random news
        displayBlogs(articles); // Display the fetched articles
    } catch (error) {
        console.error("Error fetching random news", error);
    }
})();