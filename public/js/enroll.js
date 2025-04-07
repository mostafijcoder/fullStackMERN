
/*
document.getElementById("enrollForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.querySelector("input[name='email']").value;
    const zipCode = document.querySelector("input[name='zipCode']").value;
    const courseId = document.querySelector("select[name='courseId']").value;
    const multiple = document.querySelector("input[name='multiple']:checked").value;

    const response = await fetch("/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, zipCode, courseId, multiple })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;
});
