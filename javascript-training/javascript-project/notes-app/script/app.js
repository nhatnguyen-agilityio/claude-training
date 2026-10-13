const addBtn = document.querySelector(".add");

addBtn.addEventListener("click", () => {
  addNotes();
});

window.addEventListener('load', () => {
  const notes = JSON.parse(localStorage.getItem('notes'))
  if(notes) {
    notes.forEach((item) => {
      addNotes(item)
  })}
})

const addNotes = (noteItem = "") => {
  const note = document.createElement("div");
  note.classList.add("container");
  note.innerHTML = `
    <div class="tools">
      <button class="btn edit"><i class="fas fa-edit"></i></button>
      <button class="btn delete">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
    <div class="main hidden"></div>
    <textarea class="text" name="" id=""></textarea>
  `;

  const main = note.querySelector('.main');
  const text = note.querySelector('.text');
  const editBtn = note.querySelector('.edit');
  const deleteBtn = note.querySelector('.delete');
  text.value =noteItem;
  main.innerHTML =noteItem;
  editBtn.addEventListener('click', () => {
    main.classList.toggle('hidden');
    text.classList.toggle('hidden');
  })

  deleteBtn.addEventListener('click', () => {
    note.remove()
  })

  text.addEventListener('input', (e) => {
    main.innerHTML = marked(e.target.value);
    const notesText = document.querySelectorAll("textarea");

    const notes = [];

    notesText.forEach((note) => {
        notes.push(note.value);
    });

    localStorage.setItem("notes", JSON.stringify(notes));
  })
  document.body.appendChild(note);
}

