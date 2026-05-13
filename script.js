let todoElements = JSON.parse(localStorage.getItem("todoElements")) || [];  
let editingIndex = null;

function addName() {
  const name = document.getElementById('name').value;
  if (editingIndex == null) {
    todoElements.unshift(name);
  } else {
   todoElements[editingIndex] = name;
    editingIndex = null; 
  }
  localStorage.setItem("todoElements", JSON.stringify(todoElements));
  document.getElementById('name').value = '';
  listElements();
}
function listElements() {
  const item = document.querySelector('.list-items');
  item.innerHTML = ''; 
  todoElements.forEach((element, index) => {
    const li = document.createElement('li');
    li.textContent = element;

    if (element) {
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.classList.add('remove-button');
      removeButton.onclick = () => removeItem(index);

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-button');
      editButton.onclick = () => editItem(index);

      li.appendChild(removeButton);
      li.appendChild(editButton);
      item?.appendChild(li);
    }
  });
}
function removeItem(index) {
  todoElements = todoElements.filter((_, i) => i !== index);
  localStorage.setItem("todoElements", JSON.stringify(todoElements)); 
  listElements(); 
}
function editItem(index) {
  editingIndex = index;  
  document.getElementById('name').value = todoElements[editingIndex];  
  const button = document.getElementById('button-save');
  button.textContent = 'Save';  
}
document.addEventListener('DOMContentLoaded', listElements);




