const form = document.getElementById("progressForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const progressList = document.getElementById("progressList");
const status = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");

// Fetch all progress entries from the backend
async function loadProgress() {
    status.textContent = "Loading progress...";
    progressList.replaceChildren();

    try {
        const response = await fetch("/api/progress");
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to load progress.");
        }

        if (result.data.length === 0) {
            status.textContent = "No progress entries yet.";
            return;
        }

        status.textContent =
            `${result.count} progress entr${result.count === 1 ? "y" : "ies"}`;

        result.data.forEach((item) => {
            const card = document.createElement("article");
            card.className = "progress-card";

            const name = document.createElement("h3");
            name.textContent = item.studentName;

            const course = document.createElement("p");
            course.className = "course";
            course.textContent = item.courseName;

            const info = document.createElement("div");
            info.className = "progress-info";

            const label = document.createElement("span");
            label.textContent = "Completion";

            const percentage = document.createElement("span");
            percentage.className = "percentage";
            percentage.textContent =
               `${item.completionPercentage}%`;

            info.append(label, percentage);

            const track = document.createElement("div");
            track.className = "progress-track";

            const fill = document.createElement("div");
            fill.className = "progress-fill";
            fill.style.width = `${item.completionPercentage}%`;

            track.appendChild(fill);

            const date = document.createElement("p");
            date.className = "date";
            date.textContent =
               `Last updated: ${new Date(item.lastUpdated).toLocaleString()}`;

            card.append(name, course, info, track, date);
            progressList.appendChild(card);
        });

        } catch (error) {
            status.textContent = error.message;
        }
    }

 // Submit a new progress entry
 form.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.innerText = "";
    submitBtn.disabled = true;

    const formData = new FormData(form);

    const progress = {
        studentName: formData.get("studentName"),
        courseName: formData.get("courseName"),
        completionPercentage:
            Number(formData.get("completionPercentage"))
    };

    try {
        const response = await fetch("/api/progress", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(progress)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to save progress.");
        }

        message.innerText = result.message;
        form.reset();

        await loadProgress();

    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitBtn.disabled = false;
    }
});

refreshBtn.addEventListener("click", loadProgress);

 // Load saved progress when the page opens
loadProgress();