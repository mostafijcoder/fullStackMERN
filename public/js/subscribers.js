
// subscribers dynamic filtering
/*
    // Existing search form handler
    document.getElementById("searchForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
        
        const zipCode = document.getElementById("zipCode").value.trim();

        if (!zipCode) {
            alert("Please enter a ZIP Code.");
            return;
        }

        // Dynamically update the URL with the search query
        const newUrl = `/subscribers?zipCode=${encodeURIComponent(zipCode)}`;
        history.pushState({ path: newUrl }, '', newUrl);  // Update URL without page reload

        fetch(newUrl, {headers: { "X-Requested-With": "XMLHttpRequest" }})
            .then(response => response.json()) // ✅ Expect JSON response
            .then(data => {
                console.log("✅ Received Data from Server:", data);
                const tableBody = document.getElementById("subscriberTable");
                tableBody.innerHTML = ""; // Clear existing table rows
                
                if (data.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='4'>No subscribers found.</td></tr>";
                    return;
                }

                data.forEach((subscriber, index) => {
                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${subscriber.name}</td>
                            <td>${subscriber.email}</td>
                            <td>${subscriber.zipCode}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            })
            .catch(error => console.error("❌ Error fetching subscribers:", error));
    });
    