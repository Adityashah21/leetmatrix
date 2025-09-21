document.addEventListener("DOMContentLoaded", function () {
    // --- Get references to all the new HTML elements ---
    const userForm = document.getElementById("user-form");
    const searchButton = document.getElementById("search-button");
    const userInput = document.getElementById("user-input");
    const statsContainer = document.getElementById("stats-container");
    const root = document.documentElement; // Used to update CSS variables

    // Progress circle values
    const easySolvedEl = document.getElementById("easy-solved");
    const easyTotalEl = document.getElementById("easy-total");
    const mediumSolvedEl = document.getElementById("medium-solved");
    const mediumTotalEl = document.getElementById("medium-total");
    const hardSolvedEl = document.getElementById("hard-solved");
    const hardTotalEl = document.getElementById("hard-total");

    // Stats card values
    const totalSolvedEl = document.getElementById("total-solved");
    const acceptanceRateEl = document.getElementById("acceptance-rate");
    const rankingEl = document.getElementById("ranking");

    // Function to validate the username (your original function is great)
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        // LeetCode usernames can be up to 20 chars
        const regex = /^[a-zA-Z0-9_.-]{1,20}$/; 
        if (!regex.test(username)) {
            alert("Invalid username format");
            return false;
        }
        return true;
    }

    // --- Function to update the UI with fetched data ---
    function updateUI(data) {
        // 1. Update the text content of all elements
        easySolvedEl.textContent = data.easySolved;
        easyTotalEl.textContent = `/ ${data.totalEasy}`;
        mediumSolvedEl.textContent = data.mediumSolved;
        mediumTotalEl.textContent = `/ ${data.totalMedium}`;
        hardSolvedEl.textContent = data.hardSolved;
        hardTotalEl.textContent = `/ ${data.totalHard}`;

        totalSolvedEl.textContent = data.totalSolved;
        acceptanceRateEl.textContent = `${data.acceptanceRate}%`;
        rankingEl.textContent = data.ranking;

        // 2. Calculate percentages and degrees for the progress circles
        const easyPercent = data.totalEasy > 0 ? (data.easySolved / data.totalEasy) * 360 : 0;
        const mediumPercent = data.totalMedium > 0 ? (data.mediumSolved / data.totalMedium) * 360 : 0;
        const hardPercent = data.totalHard > 0 ? (data.hardSolved / data.totalHard) * 360 : 0;

        // 3. Update the CSS custom properties to draw the circles
        root.style.setProperty('--easy-percent', `${easyPercent}deg`);
        root.style.setProperty('--medium-percent', `${mediumPercent}deg`);
        root.style.setProperty('--hard-percent', `${hardPercent}deg`);

        // 4. Make the stats container visible
        statsContainer.style.display = "block";
    }

    // --- Main async function to fetch user details ---
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        
        // Hide stats and show loading state
        statsContainer.style.display = "none";
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Check if the API returned an error
            if (data.status === "error" || !response.ok) {
                throw new Error(data.message || "User not found");
            }
            
            // If successful, update the UI
            updateUI(data);

        } catch (error) {
            console.error(error);
            alert(error.message); // Show a more specific error
        } finally {
            // Reset the button state
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // --- Event Listener for the form submission ---
    userForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents the page from reloading
        const username = userInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});