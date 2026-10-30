const API_URL = "http://localhost:8080/api/students";

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const message = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");

let editingStudentId = null;

// Display messages
function showMessage(text, isError = false) {
message.textContent = text;
message.style.color = isError ? "red" : "green";
}

// Load and display students
async function loadStudents() {
studentList.innerHTML =
'<tr><td colspan="5">Loading students...</td></tr>';


try {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }

    const students = await response.json();

    studentList.innerHTML = "";

    if (students.length === 0) {
        studentList.innerHTML =
            '<tr><td colspan="5">No students found.</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = document.createElement("tr");

        [student.id, student.name, student.email, student.course]
            .forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.addEventListener("click", () => editStudent(student));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.style.marginLeft = "5px";
        deleteButton.style.backgroundColor = "#dc2626";
        deleteButton.addEventListener("click", () => deleteStudent(student.id));

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        studentList.appendChild(row);
    });

} catch (error) {
    studentList.innerHTML =
        '<tr><td colspan="5">Could not load students.</td></tr>';

    showMessage(error.message, true);
}


}

// Add or update a student
studentForm.addEventListener("submit", async function (event) {
event.preventDefault();


const student = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    course: "CSE"
};

if (!student.name || !student.email) {
    showMessage("Please enter name and email.", true);
    return;
}

const isEditing = editingStudentId !== null;

const url = isEditing
    ? `${API_URL}/${editingStudentId}`
    : API_URL;

try {
    const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Request failed");
    }

    showMessage(
        isEditing
            ? "Student updated successfully!"
            : "Student added successfully!"
    );

    studentForm.reset();
    editingStudentId = null;

    const submitButton = studentForm.querySelector('button[type="submit"]');
    submitButton.textContent = "Add Student";

    await loadStudents();

} catch (error) {
    showMessage("Error: " + error.message, true);
}


});

// Fill form with existing student details
function editStudent(student) {
editingStudentId = student.id;


document.getElementById("name").value = student.name ?? "";
document.getElementById("email").value = student.email ?? "";

const submitButton = studentForm.querySelector('button[type="submit"]');
submitButton.textContent = "Update Student";

showMessage("Edit the details and click Update Student.");

studentForm.scrollIntoView({ behavior: "smooth" });


}

// Delete a student
async function deleteStudent(id) {
const confirmed = confirm("Are you sure you want to delete this student?");


if (!confirmed) {
    return;
}

try {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete student");
    }

    showMessage("Student deleted successfully!");
    await loadStudents();

} catch (error) {
    showMessage("Error: " + error.message, true);
}


}

// Refresh student list
refreshBtn.addEventListener("click", loadStudents);
