let schoolInfo = {};
let editMode = false;

let currentIndex = -1;

const addButton = document.getElementById("add");

const validateData = (index) => {
  let response = {
    result: true,
    message: "",
  };

  let filledInputs = [...document.querySelectorAll(".teachers input")].reduce(
    (prevResult, input) => {
      return prevResult && input.value !== "";
    },
    document.querySelectorAll(".teachers input")[0].value !== ""
  );
  if (!filledInputs) {
    response.result = false;
    response.message = "Todos los campos son obligatorios";
  } else if (
    schoolInfo.teachers.find(
      (item) => item.rfc === document.getElementById("rfc").value
    ) &&
    !editMode
  ) {
    response.result = false;
    response.message = "El RFC ya se encuentra registrado";
  } else if (
    schoolInfo.teachers.find(
      (item) =>
        item.funcion === document.getElementById("funcion").options.value
    ) &&
    schoolInfo.teachers.length > 0 &&
    document.getElementById("funcion").options.value === "Director"
  ) {
    response.result = false;
    response.message = "Ya existe una persona con función de Director";
  }
  console.log(response);
  return response;
};

const loadData = () => {
  return (schoolInfo = localStorage.getItem("schoolInfo"));
};

const deleteRow = (index) => {
  console.log("delete");
  document.querySelector(".responsive-table tbody").innerHTML = "";
  schoolInfo.teachers.splice(index, 1);
  localStorage.setItem("schoolInfo", JSON.stringify(schoolInfo));
  fillTable();
  updateRecordInfo();
  editMode ? document.getElementById("cancel").click() : "";
};

const editRow = (index) => {
  editMode = true;
  currentIndex = index;
  addButton.innerHTML = "Editar";
  let inputs = document.querySelectorAll(".teachers input ");
  let data = Object.values(schoolInfo.teachers[index]);
  for (let i = 0; i < data.length - 1; i++) {
    inputs[i].value = data[i];
  }
  document.getElementById("funcion").selectedIndex = Array.from(
    document.querySelectorAll("#funcion option")
  ).findIndex((item) => item.value === data[data.length - 1]);
  document.getElementById("rfc").focus();
  document.querySelector(".teachers").classList.add("edit");

  /*  for (let key in schoolInfo.teachers[index]) {
    schoolInfo.teachers[index][key] = "";
  } */

  console.log(schoolInfo.teachers[index]);
};

/* Add row with data */
const addRow = (teacherInfo, index) => {
  let tableBody = document.getElementById("data");
  let row = document.createElement("tr");
  let titles = Array.from(document.querySelectorAll("th"));
  let values = Object.values(teacherInfo);

  for (let i = 0; i < values.length; i++) {
    let td = null;
    if (i === 0) {
      row.innerHTML = `<th scope="row" data-tittle="${titles[i].innerHTML}">${values[i]}</td>`;
    } else {
      row.innerHTML += `<td data-tittle="${titles[i].innerHTML}">${values[i]}</td>`;
    }
  }
  row.innerHTML += `<td><button type="button" class="primary" onclick="editRow(${index})">Editar</button><button type="button" class="delete-button" onclick="deleteRow(${index})">Borrar</button></td>`;
  tableBody.appendChild(row);
};

/* Display information about number of records  */
const updateRecordInfo = () => {
  schoolInfo.teachers.length > 0
    ? (document.querySelector(
        ".warning"
      ).innerHTML = `Se han encontrado ${schoolInfo.teachers.length} registros`)
    : (document.querySelector(".warning").innerHTML =
        "Aún no ha guardado ningún registro");
};

/* Update teacher info when edit button is clicked */
const updateRow = (teacherInfo, index) => {
  let tr = document.querySelectorAll(`#data tr:nth-child(${index}) *`);
  let values = Object.values(teacherInfo);
  for (let i = 0; i < values.length; i++) {
    tr[i].innerHTML = values[i];
  }
};

/* Fill Table with data from Local Storage */
const fillTable = () => {
  schoolInfo.teachers.forEach((teacher, index) => {
    let teacherDisplayInfo = {
      fullname: `${teacher.paterno} ${teacher.materno} ${teacher.nombre}`,
      rfc: teacher.rfc,
      funcion: teacher.funcion,
    };
    addRow(teacherDisplayInfo, index);
  });
};

/* Toggle 'hidden' class depending on input data flow.Info display*/
const showInstructions = () => {
  document.querySelector(".teachers").classList.toggle("hidden");
  document.querySelector(".school").classList.toggle("hidden");
  document.getElementById("school-stage").classList.toggle("hidden");
  document.getElementById("teacher-stage").classList.toggle("hidden");
  document.querySelector("#list h2 span").innerHTML = schoolInfo.claveEscuela;
  updateRecordInfo();
};

/* Get data from Local Storage */
window.addEventListener("load", () => {
  console.log("ready");
  schoolInfo = JSON.parse(loadData());
  if (!schoolInfo) {
    schoolInfo = {
      claveEscuela: "",
      teachers: [],
    };
  } else {
    showInstructions();
    fillTable();
  }
});

/* Continue Button Event Listener */
document.getElementById("continue").addEventListener("click", () => {
  if (document.getElementById("cct").value !== "") {
    schoolInfo.claveEscuela = document.getElementById("cct").value;
    try {
      localStorage.setItem("schoolInfo", JSON.stringify(schoolInfo));
      showInstructions();
    } catch (error) {
      console.log("Error al guardar en LocalStorage");
    }
  }
});

/* Save Button Event Listener */
addButton.addEventListener("click", () => {
  let rfc = document.getElementById("rfc").value;
  let paterno = document.getElementById("paterno").value;
  let materno = document.getElementById("materno").value;
  let nombre = document.getElementById("nombre").value;
  let funcion = document.getElementById("funcion").value;

  if (validateData().result) {
    let teacherInfo = {
      rfc: rfc,
      paterno: paterno,
      materno: materno,
      nombre: nombre,
      funcion: funcion,
    };

    let teacherDisplayInfo = {
      fullname: `${teacherInfo.paterno} ${teacherInfo.materno} ${teacherInfo.nombre}`,
      rfc: teacherInfo.rfc,
      funcion: teacherInfo.funcion,
    };

    if (!editMode) {
      schoolInfo.teachers.push(teacherInfo);
      addRow(teacherDisplayInfo, schoolInfo.teachers.length - 1);
    } else {
      schoolInfo.teachers[currentIndex] = JSON.parse(
        JSON.stringify(teacherInfo)
      );
      updateRow(teacherDisplayInfo, currentIndex + 1);
      editMode = false;
      addButton.innerHTML = "Guardar";
    }
    localStorage.setItem("schoolInfo", JSON.stringify(schoolInfo));
    updateRecordInfo();
  }
  document.getElementById("cancel").click();
});

/* Cancel Button Event Listener */
document.getElementById("cancel").addEventListener("click", () => {
  document.getElementById("rfc").focus();
  addButton.innerHTML = "Guardar";
  if (editMode) {
    editMode = false;
  }
  document.querySelector(".teachers").classList.remove("edit");
});
