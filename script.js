function sendmail() {
    let parms = {
        name: document.getElementById("cn").value,
        email: document.getElementById("ce").value,
        subject: document.getElementById("cs").value,
        message: document.getElementById("cm").value,
    };

    emailjs.send("service_a3742aq", "template_hi15oz3", parms)
        .then(() => {
            alert("Email sent successfully!");
        })
        .catch((error) => {
            console.error("Email failed:", error);
            alert("Failed to send email.");
        });
}