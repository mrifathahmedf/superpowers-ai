const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const results = document.querySelector("#results");
const statusBox = document.querySelector("#status");
const submit = document.querySelector(".submit");

const examples = {
  "স্টার্টআপ আইডিয়া": "বাংলাদেশে ছোট ব্যবসার জন্য এআই ব্যবহার করে লাভজনক স্টার্টআপ আইডিয়া কী হতে পারে?",
  "ভ্রমণ পরিকল্পনা": "তিন দিনের সিলেট ভ্রমণের জন্য পরিবারবান্ধব পরিকল্পনা দাও",
  "স্বাস্থ্যকর খাবার": "অফিসে নিয়ে যাওয়ার মতো কম খরচের স্বাস্থ্যকর দুপুরের খাবারের আইডিয়া দাও",
};

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    queryInput.value = examples[chip.textContent.trim()] || chip.textContent.trim();
    queryInput.focus();
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = queryInput.value.trim();

  if (!query) {
    showStatus("একটি প্রশ্ন লিখুন।", "error");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "সার্চ সম্পন্ন হয়নি।");
    }

    renderResults(data);
    showStatus("উত্তর তৈরি হয়েছে।", "success");
  } catch (error) {
    showStatus(error.message || "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    results.className = "results empty";
    results.innerHTML = `
      <div class="empty-state">
        <span class="empty-line"></span>
        <h2>সার্চ ব্যর্থ হয়েছে</h2>
        <p>প্রশ্নটি একটু বদলে আবার চেষ্টা করুন।</p>
      </div>
    `;
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  submit.disabled = isLoading;
  submit.querySelector("span").textContent = isLoading ? "খোঁজা হচ্ছে" : "সার্চ";

  if (isLoading) {
    showStatus("এআই উত্তর সাজাচ্ছে...", "pending");
    results.className = "results empty";
    results.innerHTML = `
      <div class="result-card skeleton" aria-label="Loading result">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    `;
  }
}

function renderResults(data) {
  results.className = "results";
  results.innerHTML = `
    <article class="result-card">
      <h2>${escapeHtml(data.title || "সার্চ ফলাফল")}</h2>
      <div class="answer">${escapeHtml(data.answer || "")}</div>
    </article>
    <aside class="side-stack">
      <section class="side-card">
        <h3>মূল পয়েন্ট</h3>
        <ul class="item-list">${listItems(data.keyPoints)}</ul>
      </section>
      <section class="side-card">
        <h3>আরও খুঁজুন</h3>
        <ul class="item-list">${listItems(data.followUps)}</ul>
      </section>
      <section class="side-card">
        <h3>যাচাই করুন</h3>
        <ul class="item-list">${listItems(data.verify)}</ul>
      </section>
    </aside>
  `;
}

function listItems(items = []) {
  const safeItems = items.length ? items : ["আরও নির্দিষ্ট প্রশ্ন করলে ভালো ফল পাবেন।"];
  return safeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function showStatus(message, type) {
  statusBox.hidden = false;
  statusBox.textContent = message;
  statusBox.dataset.type = type;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
