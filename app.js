const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login-btn');
const userDashboard = document.getElementById('user-dashboard');
const userUsername = document.getElementById('user-username');
const postContent = document.getElementById('post-content');
const postButton = document.getElementById('post-btn');
const postList = document.getElementById('post-list');
const followUsernameInput = document.getElementById('follow-username');
const followButton = document.getElementById('follow-btn');

let currentUser = null;
let users = {};

document.addEventListener('DOMContentLoaded', () => {
    users = JSON.parse(localStorage.getItem('users')) || {};
    loadPosts();
});

loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username !== '') {
        currentUser = username;
        loginForm.style.display = 'none';
        userDashboard.style.display = 'block';
        userUsername.textContent = username;

        if (!users[currentUser]) {
            users[currentUser] = { follows: [] };
        }

        saveUsers();
        loadPosts();
    }
});

postButton.addEventListener('click', () => {
    const content = postContent.value.trim();
    if (content !== '') {
        const post = {
            username: currentUser,
            content: content
        };
        savePost(post);
        postContent.value = '';
        loadPosts();
    }
});

followButton.addEventListener('click', () => {
    const followUsername = followUsernameInput.value.trim();
    if (followUsername !== '' && followUsername !== currentUser) {
        if (!users[currentUser].follows.includes(followUsername)) {
            users[currentUser].follows.push(followUsername);
            saveUsers();
            loadPosts();
        } else {
            alert('You are already following this user.');
        }
    }
});

function savePost(post) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    postList.innerHTML = '';
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const userFollows = users[currentUser] ? users[currentUser].follows : [];

    posts.forEach(post => {
        if (post.username === currentUser || userFollows.includes(post.username)) {
            const postItem = document.createElement('li');
            postItem.innerHTML = `<p><strong>${post.username}</strong>: ${post.content}</p>`;
            postList.appendChild(postItem);
        }
    });
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify({}));
}
if (!localStorage.getItem('posts')) {
    localStorage.setItem('posts', JSON.stringify([]));
}
