let schoolInfo = {};
let showTeacherForm = false;
let schoolForm = document.querySelector(".school");
let teachersForm = document.querySelector(".teachers");
let schoolInstructions = document.getElementById("school-stage");
let teacherInstructions = document.getElementById("teacher-stage");

const continueButton = document.getElementById("continue");
const addButton = document.getElementById("add");

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
  });
  return deleteButton;
};

const addEditButton = () => {
  let editButton = document.createElement("button");
  editButton.setAttribute("type", "button");
  editButton.classList.add("edit-button");
  editButton.innerHTML = "Editar";

  editButton.addEventListener("click", (e) => {
    let inputs = document.querySelectorAll(".teachers input ");
    let node = e.target.parentNode.parentNode;
    let rfc = node.childNodes[1].innerHTML;
    let data = Object.values(
      schoolInfo.teachers.find((item) => item.rfc === rfc)
    );
    for (let i = 0; i < data.length - 1; i++) {
      inputs[i].value = data[i];
    }

    let options = Array.from(document.querySelectorAll("#funcion option"));
    document.getElementById("funcion").selectedIndex = options.findIndex(
      (item) => item.innerHTML === data[data.length - 1]
    );
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
  actionTD.setAttribute("data-tittle", "Acción");
  actionTD.appendChild(addEditButton());
  actionTD.appendChild(addDeleteButton());
  row.appendChild(actionTD);
  tableBody.appendChild(row);
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

const showData = () => {
  teachersForm.classList.toggle("hidden");
  schoolForm.classList.toggle("hidden");
  schoolInstructions.classList.toggle("hidden");
  teacherInstructions.classList.toggle("hidden");
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
    showData();
    fillTable();
  }
});

continueButton.addEventListener("click", () => {
  if (document.getElementById("cct").value !== "") {
    schoolInfo.claveEscuela = document.getElementById("cct").value;
    try {
      localStorage.setItem("schoolInfo", JSON.stringify(schoolInfo));
      showData();
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

  let functionSelect = document.getElementById("funcion");
  let functionText = functionSelect.options[functionSelect.selectedIndex].text;

  let teacherInfo = {
    rfc: rfc,
    paterno: paterno,
    materno: materno,
    nombre: nombre,
    funcion: functionText,
  };

  schoolInfo.teachers.push(teacherInfo);
  localStorage.setItem("schoolInfo", JSON.stringify(schoolInfo));

  let teacherDisplayInfo = {
    fullname: `${teacherInfo.paterno} ${teacherInfo.materno} ${teacherInfo.nombre}`,
    rfc: teacherInfo.rfc,
    funcion: teacherInfo.funcion,
  };

  addRow(teacherDisplayInfo);
});
