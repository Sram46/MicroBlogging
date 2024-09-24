const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-btn');
const userDashboard = document.getElementById('user-dashboard');
const userUsername = document.getElementById('user-username');
const postContent = document.getElementById('post-content');
const postMedia = document.getElementById('post-media');
const postButton = document.getElementById('post-btn');
const postList = document.getElementById('post-list');
const followUsernameInput = document.getElementById('follow-username');
const followButton = document.getElementById('follow-btn');

let currentUser = null;

let users = JSON.parse(localStorage.getItem('users')) || {};
users['user1'] = { password: 'pass1', follows: [] };
users['user2'] = { password: 'pass2', follows: [] };
users['user3'] = { password: 'pass3', follows: [] };
users['user4'] = { password: 'pass4', follows: [] };
users['user5'] = { password: 'pass5', follows: [] };
users['user6'] = { password: 'pass6', follows: [] };
users['user7'] = { password: 'pass7', follows: [] };
users['user8'] = { password: 'pass8', follows: [] };
users['user9'] = { password: 'pass9', follows: [] };
users['user10'] = { password: 'pass10', follows: [] };
localStorage.setItem('users', JSON.stringify(users));

document.addEventListener('DOMContentLoaded', () => {
    users = JSON.parse(localStorage.getItem('users')) || {};
    loadPosts();
});

loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username !== '' && password !== '') {
        if (users[username] && users[username].password === password) {
            currentUser = username;
            loginForm.style.display = 'none';
            userDashboard.style.display = 'block';
            userUsername.textContent = username;

            if (!users[currentUser]) {
                users[currentUser] = { follows: [] };
            }

            saveUsers();
            loadPosts();
        } else {
            alert('Invalid username or password.');
        }
    }
});

postButton.addEventListener('click', () => {
    const content = postContent.value.trim();
    const media = postMedia.files[0];
    if (content !== '' || media) {
        const post = {
            username: currentUser,
            content: content,
            media: media ? URL.createObjectURL(media) : null,
            likes: 0,
            dislikes: 0,
            comments: []
        };
        savePost(post);
        postContent.value = '';
        postMedia.value = '';
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

    posts.forEach((post, index) => {
        if (post.username === currentUser || userFollows.includes(post.username)) {
            const postItem = document.createElement('li');
            postItem.innerHTML = `
                <p><strong>${post.username}</strong>: ${post.content}</p>
                ${post.media ? `<img src="${post.media}" alt="Post Media" style="max-width: 100%; height: auto;"/>` : ''}
                <button class="like-btn" data-index="${index}">👍 Like (${post.likes})</button>
                <button class="dislike-btn" data-index="${index}">👎 Dislike (${post.dislikes})</button>
                <div>
                    <input type="text" class="comment-input" placeholder="Add a comment..." data-index="${index}">
                    <button class="comment-btn" data-index="${index}">💬 Comment</button>
                </div>
                <div class="comments" data-index="${index}">
                    ${post.comments.map(comment => `<p>${comment}</p>`).join('')}
                </div>
            `;
            postList.appendChild(postItem);
        }
    });

    // Attach event listeners for like, dislike, and comment buttons
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            likePost(index);
        });
    });

    document.querySelectorAll('.dislike-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            dislikePost(index);
        });
    });

    document.querySelectorAll('.comment-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const input = document.querySelector(`.comment-input[data-index="${index}"]`);
            addComment(index, input.value);
            input.value = '';
        });
    });
}

function likePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[index].likes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts(); // Refresh the posts to show updated like count
}

function dislikePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[index].dislikes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts(); // Refresh the posts to show updated dislike count
}

function addComment(index, comment) {
    if (comment.trim() === '') return;
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[index].comments.push(comment);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts(); // Refresh the posts to show updated comments
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
