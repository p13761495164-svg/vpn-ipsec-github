const copyButtons = document.querySelectorAll("[data-copy-link]");
const toast = document.querySelector(".toast");
let toastTimer;

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();

  if (!copied) throw new Error("copy failed");
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const link = new URL(button.dataset.copyLink, window.location.href).href;
    const label = button.querySelector(".copy-label");

    try {
      await copyText(link);
      if (label) label.textContent = "已复制";
      button.classList.add("is-copied");
      showToast("文章链接已复制");
      window.setTimeout(() => {
        if (label) label.textContent = "复制链接";
        button.classList.remove("is-copied");
      }, 1800);
    } catch {
      showToast("复制失败，请长按文章标题复制链接");
    }
  });
});
