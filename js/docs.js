window.addEventListener("load", () => {
    document.querySelectorAll(".copy-endpoint").forEach(_copy => {
        _copy.addEventListener("click", () => {
            const copyclass = _copy.getAttribute("data-copyclass")
            if (!copyclass || !_copy.parentElement.querySelector(copyclass)) return
            navigator.clipboard.writeText(_copy.parentElement.querySelector(copyclass).textContent)
            _copy.textContent = "COPIED!"
            setTimeout(() => _copy.textContent = "COPY", 1000);
        })
    })
    document.querySelectorAll(".copy-codeblock").forEach(_copy => {
        _copy.addEventListener("click", () => {
            const codeblockContent = _copy.parentElement.querySelector(".codeblock-multiline-content")
            if (!codeblockContent) return
            console.log(codeblockContent.innerText.replace(/(?<=\n)\n/gm, ""));
            navigator.clipboard.writeText(codeblockContent.innerText.replace(/(?<=\n)\n/gm, ""))
            _copy.textContent = "COPIED!"
            setTimeout(() => _copy.textContent = "COPY", 1000);
        })
    })
})