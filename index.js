const modalWrapper = document.querySelector(".modal-wrapper");
// modal add
const addCake = document.querySelector(".add-cake");
const addCakeForm = document.querySelector(".add-cake .form");

// modal edit
const editCake = document.querySelector(".edit-cake");
const editCakeForm = document.querySelector(".edit-cake .form");

const btnAdd = document.querySelector(".btn-add");

const tableCakes = document.querySelector(".table-cakes");

let id;
const db = firebase.firestore();

// Create element and render users
const renderCake = (doc) => {
  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().flavor}</td>
      <td>${doc.data().frosting}</td>
      <td>${doc.data().shape}</td>
      <td>${doc.data().size}</td>
      <td>${doc.data().price}</td>
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
  `;
  tableCakes.insertAdjacentHTML("beforeEnd", tr);

  // Click edit user
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener("click", () => {
    editCake.classList.add("modal-show");

    id = doc.id;
    editCakeForm.flavor.value = doc.data().flavor;
    editCakeForm.frosting.value = doc.data().frosting;
    editCakeForm.shape.value = doc.data().shape;
    editCakeForm.size.value = doc.data().size;
    editCakeForm.price.value = doc.data().price;
  });

  // Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener("click", () => {
    db.collection("cakes")
      .doc(`${doc.id}`)
      .delete()
      .then(() => {
        console.log("Cake was succesfully deleted!");
      })
      .catch((err) => {
        console.log("Error while removing cake.", err);
      });
  });
};

// Click add user button
btnAdd.addEventListener("click", () => {
  addCake.classList.add("modal-show");
  document.querySelector("#add").classList.remove("hide-form");
  addCakeForm.flavor.value = "";
  addCakeForm.frosting.value = "";
  addCakeForm.shape.value = "";
  addCakeForm.size.value = "";
  addCakeForm.price.value = "";
});

// Modal disappears when the user clicks outside of the modal
window.addEventListener("click", (e) => {
  if (e.target === addCake) {
    addCake.classList.remove("modal-show");
  }
  if (e.target === editCake) {
    editCake.classList.remove("modal-show");
  }
});

// Get all cakes
// db.collection('cakes').get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     renderCake(doc);
//   })
// });

// Real time listener
db.collection("cakes").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      renderCake(change.doc);
    }
    if (change.type === "removed") {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableCakes.removeChild(tbody);
    }
    if (change.type === "modified") {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableCakes.removeChild(tbody);
      renderCake(change.doc);
    }
  });
});

// Click submit in add modal
addCakeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cakes").add({
    flavor: addCakeForm.flavor.value,
    frosting: addCakeForm.frosting.value,
    shape: addCakeForm.shape.value,
    size: addCakeForm.size.value,
    price: addCakeForm.price.value,
  });
  addCakeForm.flavor.value = "";
  addCakeForm.frosting.value = "";
  addCakeForm.shape.value = "";
  addCakeForm.size.value = "";
  addCakeForm.price.value = "";

  modalWrapper.classList.remove("modal-show");
});

// Click submit in edit modal
editCakeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cakes").doc(id).update({
    flavor: editCakeForm.flavor.value,
    frosting: editCakeForm.frosting.value,
    shape: editCakeForm.shape.value,
    size: editCakeForm.size.value,
    price: editCakeForm.price.value,
  });
  editCake.classList.remove("modal-show");
});
