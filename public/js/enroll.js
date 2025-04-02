document.getElementById("enrollForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const subscriberId = document.getElementById("subscriber").value;
    const courseId = document.getElementById("course").value;
    const multiple = document.querySelector("input[name='multiple']:checked").value;

    fetch("/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriberId, courseId, multiple })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").innerText = data.message;
    })
    .catch(error => console.error("❌ Error:", error));
});
