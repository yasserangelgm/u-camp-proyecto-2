let schoolInfo = {};
let editMode = false;

/* TODO: Modificar funciones de editar y eliminar dentro de showInstructions  */
let currentIndex = -1;

const addButton = document.getElementById("add");

const validateData = () => {
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

const addDeleteButton = () => {
  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerHTML = "Borrar";
  deleteButton.addEventListener("click", (e) => {
    let node = e.target.parentNode.parentNode;
    let rfc = node.childNodes[1].innerHTML;
    let index = schoolInfo.teachers.findIndex((item) => item.rfc === rfc);
    schoolInfo.teachers.splice(index, 1);
    localStorage.setItem("schoolInfo", JSON.stringify(schoolInfo));
    e.target.parentNode.parentNode.parentNode.removeChild(node);
    updateRecordInfo();
    editMode ? document.getElementById("cancel").click() : "";
  });
  return deleteButton;
};

const addEditButton = () => {
  let editButton = document.createElement("button");
  editButton.setAttribute("type", "button");
  editButton.classList.add("primary");
  editButton.innerHTML = "Editar";

  editButton.addEventListener("click", (e) => {
    editMode = true;
    addButton.innerHTML = "Editar";
    let inputs = document.querySelectorAll(".teachers input ");
    let node = e.target.parentNode.parentNode;
    let rfc = node.childNodes[1].innerHTML;
    let data = Object.values(
      schoolInfo.teachers.find((item) => item.rfc === rfc)
    );
    currentIndex = schoolInfo.teachers.findIndex((item) => item.rfc === rfc);
    for (let i = 0; i < data.length - 1; i++) {
      inputs[i].value = data[i];
    }
    let options = Array.from(document.querySelectorAll("#funcion option"));
    document.getElementById("funcion").selectedIndex = options.findIndex(
      (item) => item.innerHTML === data[data.length - 1]
    );
    document.getElementById("rfc").focus();
    document.querySelector(".teachers").classList.add("edit");
  });

  return editButton;
};

const addRow = (teacherInfo) => {
  let tableBody = document.getElementById("data");
  let row = document.createElement("tr");
  let titles = Array.from(document.querySelectorAll("th"));
  let values = Object.values(teacherInfo);

  for (let i = 0; i < values.length; i++) {
    let td = null;
    if (i === 0) {
      td = document.createElement("th");
      td.setAttribute("scope", "row");
    } else {
      td = document.createElement("td");
    }
    td.setAttribute("data-tittle", titles[i].innerHTML);
    td.innerHTML = values[i];
    row.appendChild(td);
  }
  let actionTD = document.createElement("td");
  actionTD.appendChild(addEditButton());
  actionTD.appendChild(addDeleteButton());
  row.appendChild(actionTD);
  tableBody.appendChild(row);
};

const updateRecordInfo = () => {
  schoolInfo.teachers.length > 0
    ? (document.querySelector(
        ".warning"
      ).innerHTML = `Se han encontrado ${schoolInfo.teachers.length} registros`)
    : (document.querySelector(".warning").innerHTML =
        "Aún no ha guardado ningún registro");
};

const updateRow = (index, teacherInfo) => {
  let tr = document.querySelectorAll(`#data tr:nth-child(${index}) *`);
  let values = Object.values(teacherInfo);
  for (let i = 0; i < values.length; i++) {
    tr[i].innerHTML = values[i];
  }
};

const fillTable = () => {
  schoolInfo.teachers.forEach((teacher) => {
    let teacherDisplayInfo = {
      fullname: `${teacher.paterno} ${teacher.materno} ${teacher.nombre}`,
      rfc: teacher.rfc,
      funcion: teacher.funcion,
    };
    addRow(teacherDisplayInfo);
  });
};

const showInstructions = () => {
  document.querySelector(".teachers").classList.toggle("hidden");
  document.querySelector(".school").classList.toggle("hidden");
  document.getElementById("school-stage").classList.toggle("hidden");
  document.getElementById("teacher-stage").classList.toggle("hidden");
  document.querySelector("#list h2 span").innerHTML = schoolInfo.claveEscuela;
  updateRecordInfo();
};

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

/* Botón continuar */
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
      addRow(teacherDisplayInfo);
    } else {
      schoolInfo.teachers[currentIndex] = JSON.parse(
        JSON.stringify(teacherInfo)
      );
      updateRow(currentIndex + 1, teacherDisplayInfo);
      editMode = false;
      addButton.innerHTML = "Guardar";
    }
    updateRecordInfo();
    localStorage.setItem("schoolInfo", JSON.stringify(schoolInfo));
  }

  document.getElementById("cancel").click();
});

document.getElementById("cancel").addEventListener("click", () => {
  document.getElementById("rfc").focus();
  addButton.innerHTML = "Guardar";
  if (editMode) {
    editMode = false;
  }
  document.querySelector(".teachers").classList.remove("edit");
});
