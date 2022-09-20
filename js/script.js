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

const addRow = (teacherInfo) => {
  let tableBody = document.getElementById("data");
  let row = document.createElement("tr");

  for (let key in teacherInfo) {
    let td = document.createElement("td");
    td.innerHTML = teacherInfo[key];
    row.appendChild(td);
  }
  console.log(row);
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
  addRow(teacherInfo);
});
