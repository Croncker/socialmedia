document.addEventListener("DOMContentLoaded", function() {
    const feed = document.getElementById("instagram-feed");
    const loadMoreThreshold = 200;
    let loadingMore = false;

    function renderInstagramPosts(posts) {
        posts.forEach(post => {
            const postElement = createPostElement(post);
            feed.appendChild(postElement);
        });
    }

    function createPostElement(post) {
        const postElement = document.createElement("div");
        postElement.classList.add("instagram-post");

        const imageElement = document.createElement("img");
        imageElement.src = post.image;

        const iconsElement = document.createElement("div");
        iconsElement.classList.add("instagram-icons");

        post.icons.forEach(iconClass => {
            const icon = document.createElement("i");
            icon.className = iconClass;
            iconsElement.appendChild(icon);
        });

        postElement.appendChild(imageElement);
        postElement.appendChild(iconsElement);

        return postElement;
    }

    function loadMorePosts() {
        if (!loadingMore) {
            loadingMore = true;

            // Fetch data from JSON file
            fetch('js/posts.json')
                .then(response => response.json())
                .then(data => {
                    // Simulate async operation with a timeout
                    setTimeout(() => {
                        renderInstagramPosts(data);
                        loadingMore = false;
                    }, ); // Adjust this timeout as needed
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                    loadingMore = false; // Reset the loading flag in case of error
                });
        }
    }

    // Intersection Observer configuration
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 10% visibility required to trigger
    };

    // Callback function to be executed when the intersection occurs
    function handleIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !loadingMore) {
                loadMorePosts();
            }
        });
    }

    // Creating Intersection Observer
    const observer = new IntersectionObserver(handleIntersect, options);

    // Initial load
    fetch('js/posts.json')
        .then(response => response.json())
        .then(data => {
            renderInstagramPosts(data);
            // Observing the last post element after rendering initial posts
            const lastPost = document.querySelector(".instagram-post:last-child");
            observer.observe(lastPost);
        })
        .catch(error => console.error('Error fetching initial posts:', error));

    // Observing scroll event to load more posts
    window.addEventListener("scroll", function() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const bodyHeight = document.body.offsetHeight;

        if (scrollPosition >= bodyHeight - loadMoreThreshold) {
            loadMorePosts();
        }
    });
});
