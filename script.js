document.getElementById("transcribeBtn").addEventListener("click", async () => {

    const fileInput = document.getElementById("audioFile");

    if (!fileInput.files.length) {
        alert("Please select an audio file.");
        return;
    }

    const formData = new FormData();
    formData.append("audio", fileInput.files[0]);

    document.getElementById("result").value = "Transcribing...";

    try {

        const response = await fetch("/transcribe", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.transcript) {
            document.getElementById("result").value = data.transcript;
        } else {
            document.getElementById("result").value =
                "Error: " + (data.error || "Unknown error");
        }

    } catch (error) {
        document.getElementById("result").value =
            "Error: " + error.message;
    }

});