document.addEventListener("DOMContentLoaded", async function () {
    const likeIcons = document.querySelectorAll(".like_icon");
    const shop = Shopify.shop;
    const customerId = customer_id;

    // Fetch liked products for the customer
    async function fetchLikedProducts() {
        try {
            let formData = new FormData();
            formData.append("shop", shop);
            formData.append("customer_id", customerId);

            const response = await fetch("https://likeapp.magento-development.asia/api/like/get-liked", {
                method: "POST",
                body: formData // Use FormData instead of JSON
            });

            const result = await response.json();
            if (result.success && result.liked_products) {
                return result.liked_products; // Array of liked product IDs
            }
        } catch (error) {
            console.error("Error fetching liked products: ", error);
        }
        return [];
    }

    // Update button states on page load
    async function updateButtonStates() {
        const likedProducts = await fetchLikedProducts();
        
        likeIcons.forEach(icon => {
            const productId = icon.getAttribute("data-product-id");
            if (likedProducts.includes(parseInt(productId))) {
                icon.textContent = "Liked";
            } else {
                icon.textContent = "Like";
            }
        });
    }

    updateButtonStates(); // Call the function on page load

    // Like/Unlike Click Event
    likeIcons.forEach(icon => {
        icon.addEventListener("click", async function () {
            const productId = icon.getAttribute("data-product-id");
            if (!productId) return;
    
            // Check if customer is logged in (assuming customerId is set when logged in)
            if (!customerId || customerId === "null") {
                window.location.href = "/account/login"; // Redirect to Shopify login page
                return;
            }
    
            const requestData = {
                shop: shop,
                customer_id: customerId,
                product_id: productId
            };
    
            try {
                const response = await fetch("https://likeapp.magento-development.asia/api/like/toggle", {
                    method: "POST",
                    //headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData)
                });
    
                const result = await response.json();
                if (result.success) {
                    icon.textContent = result.is_liked ? "Liked" : "Like";
                    icon.classList.toggle("liked", result.is_liked); // Toggle class
                } else {
                    console.error("Error toggling like: ", result.error);
                }
            } catch (error) {
                console.error("Network error: ", error);
            }
        });
    });
      

});




