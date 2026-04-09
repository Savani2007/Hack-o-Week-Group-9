(function () {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
    mainNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => mainNav.classList.remove("open"))
    );
  }

  const form = document.getElementById("applyForm");
  const note = document.getElementById("formNote");
  const undoBtn = document.getElementById("undoBtn");
  const redoBtn = document.getElementById("redoBtn");
  if (!form) return;

  const field = (n) => form.elements.namedItem(n);

  const snap = () => ({
    name: field("name").value,
    email: field("email").value,
    phone: field("phone").value,
    experience: field("experience").value,
  });

  const apply = (s) => {
    applying = true;
    field("name").value = s.name;
    field("email").value = s.email;
    field("phone").value = s.phone;
    field("experience").value = s.experience;
    applying = false;
    syncBtns();
  };

  let stack = [snap()];
  let i = 0;
  let applying = false;
  let t;

  const same = (a, b) =>
    a.name === b.name &&
    a.email === b.email &&
    a.phone === b.phone &&
    a.experience === b.experience;

  const push = () => {
    if (applying) return;
    const s = snap();
    if (same(s, stack[i])) return;
    stack = stack.slice(0, i + 1);
    stack.push(s);
    i = stack.length - 1;
    if (stack.length > 40) {
      stack.shift();
      i--;
    }
    syncBtns();
  };

  const syncBtns = () => {
    if (undoBtn) undoBtn.disabled = i <= 0;
    if (redoBtn) redoBtn.disabled = i >= stack.length - 1;
  };

  const undo = () => {
    if (i <= 0) return;
    i--;
    apply(stack[i]);
  };

  const redo = () => {
    if (i >= stack.length - 1) return;
    i++;
    apply(stack[i]);
  };

  form.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(push, 320);
  });
  form.addEventListener("change", () => {
    clearTimeout(t);
    push();
  });
  undoBtn?.addEventListener("click", undo);
  redoBtn?.addEventListener("click", redo);

  document.addEventListener("keydown", (e) => {
    if (!form.contains(document.activeElement) || !e.altKey || e.ctrlKey || e.metaKey)
      return;
    const k = e.key.toLowerCase();
    if (k === "z" && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if (k === "y" || (k === "z" && e.shiftKey)) {
      e.preventDefault();
      redo();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.textContent = "Thanks — we’ll contact you within 24 hours.";
    form.reset();
    stack = [snap()];
    i = 0;
    syncBtns();
  });

  syncBtns();
})();
