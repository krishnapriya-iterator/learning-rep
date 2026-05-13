let originalList = [];
let currentPage = 1;
const itemsPerPage = 10;

async function getNewList() {
    const url = "https://jsonplaceholder.typicode.com/posts";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const listData = await response.json();
        console.log(listData);

        const listItem = document.getElementById('todo-list');
        if (listData) {
        
            const ul = document.createElement('ul');
            ul.classList.add('todo-ul');
            ul.setAttribute('id', 'todo-ul');
            listItem.appendChild(ul);

            originalList = listData.map(data => {
                console.log("idcheck",listData)
                const list = document.createElement('li');
                list.classList.add('list');
                 
                 list.innerHTML = `
                   <div class="post-card> 
                   <div class="post-header">
                    <div id="post-name"><strong>Post ${data.id}</strong></div>
                    <p class="post_title">${data.title}</p>
                    </div>
                    <button class="card-button" onclick="getDetailData(${data.id})">View Post</button>
                    </div>
                `;
               
                return list;
            });

            renderPagination();
            displayItems();
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function getDetailData(postId) {
    console.log("id",postId)
    const postUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
    const commentsUrl = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
    try {
        const [postResponse, commentsResponse] = await Promise.all([
            fetch(postUrl),
            fetch(commentsUrl)
        ]);
    
        if (!postResponse.ok || !commentsResponse.ok) {
            throw new Error('Failed to fetch data');
        }
    
        const postData = await postResponse.json();
        const commentsData = await commentsResponse.json();
    
        console.log("Post Data:", postData);
        console.log("Comments Data:", commentsData);
        
        location.href = `post.html?page=${postId}`;
    
    } catch (error) {
        console.error(error.message);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const postContainer = document.getElementById("post-container");
    const commentContainer = document.getElementById("comment-container");

    if (!postContainer || !commentContainer) {
        console.error("Error: Required containers not found in the DOM.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("page");

    console.log("URL ID:", urlParams);

    if (!postId) {
        document.body.innerHTML = "<h2>Invalid Post ID.</h2>";
        return;
    }

    try {
        const postUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
        const commentsUrl = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;

        const [postResponse, commentsResponse] = await Promise.all([
            fetch(postUrl),
            fetch(commentsUrl)
        ]);

        if (!postResponse.ok || !commentsResponse.ok) {
            throw new Error("Failed to fetch data");
        }

        const post = await postResponse.json();
        const comments = await commentsResponse.json();

        
        const postItem = document.createElement("div");
        postItem.classList.add("post-list-item");
        postItem.innerHTML = `
            <div id="post-name"><strong>Post ${post.id}</strong></div>
            <div id="post-title"><strong>Post Title:</strong> ${post.title}</div>
            <p class="post-comment"><strong>Body:</strong> ${post.body}</p>
        `;
        postContainer.appendChild(postItem);

    
        comments.forEach((comment) => {
            const commentsList = document.createElement("div");
            commentsList.classList.add("comment-list-item");
            commentsList.innerHTML = `
                <div class="comments">
                    <ul id="comments-listing">
                        <li> 
                            <p id="comment-name"><strong>User:</strong> ${comment.name}</p>
                            <p id="comment-email"><strong>Email:</strong> ${comment.email}</p>
                            <p class="comment-content">${comment.body}</p>
                        </li>
                    </ul>
                </div>
            `;
            commentContainer.appendChild(commentsList);
        });

    } catch (error) {
        console.error("Error:", error.message);
        document.body.innerHTML = "<h2>Error loading data.</h2>";
    }
});



document.addEventListener('DOMContentLoaded', getNewList);

function displayItems() {
    const ul = document.getElementById('todo-ul');
    ul.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = originalList.slice(start, end);
    paginatedItems.forEach(item => ul.appendChild(item));
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        const container = document.createElement('div');
        container.setAttribute('id', 'pagination');
        container.classList.add('pagination');
        document.getElementById('todo-list').appendChild(container);
    }
    
    const totalPages = Math.ceil(originalList.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<';
    prevButton.classList.add('page-btn');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayItems();
            renderPagination();
        }
    });
    pagination.appendChild(prevButton);
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-btn');
        if (i === currentPage) button.classList.add('active');
        button.addEventListener('click', () => {
            currentPage = i;
            displayItems();
            renderPagination();
        });
        pagination.appendChild(button);
    }
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '>';
    nextButton.classList.add('page-btn');
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayItems();
            renderPagination();
        }
    });
    pagination.appendChild(nextButton);
}

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedSearch = debounce(search_text, 300);

document.getElementById('search-field')?.addEventListener('keyup', debouncedSearch);

function search_text() {
    let input = document.getElementById('search-field').value.toLowerCase();
    if (input === '') {
        displayItems();
        return;
    }
    
    let filteredItems = originalList.filter(item => item.textContent.toLowerCase().includes(input));
    
    filteredItems.sort((a, b) => {
        const aText = a.textContent.toLowerCase();
        const bText = b.textContent.toLowerCase();
        if (aText.startsWith(input) && !bText.startsWith(input)) return -1;
        if (!aText.startsWith(input) && bText.startsWith(input)) return 1;
        return 0;
    });
    
    const ul = document.getElementById('todo-ul');
    ul.innerHTML = '';
    filteredItems.forEach(item => ul.appendChild(item));
}

