$(document).ready(function () {
  $("#studentForm").hide();
  $("#editButton").hide();

  $("#addButton").click(function (e) {
    $("#studentForm").show();
    $("#addButton").hide();
    $("#editButton").hide();
    e.preventDefault();
  });

  // Get Students
  loadStudents();

  // Create Students
  $("#saveButton").click(function (e) { 
    createStudents(e);
    $("#studentForm").hide();
    $("#addButton").show();
  });

  // Update Student
  $(document).on('click', '.edit-student', function (e) {
    let student = $(this);
    $("#studentForm").show();
    $("#saveButton").hide();
    $("#addButton").hide();
    $("#editButton").show();
    loadStudentsForUpdate(student, e);
  });

  $('#editButton').click(function (e) {
    updateStudent(e);
  });

  // Delete Student
  $(document).on('click', '.delete-student', function (e) {
    deleteStudent($(this), e);
  })

});

// Load Students

function loadStudentsForUpdate(student) {
  let id = student.attr('id');
  let name = student.data('name'); // Use data attribute to get the name
  let address = student.data('address'); // Use data attribute to get the address

  $('#id').val(id);
  $('#nameInput').val(name);
  $('#addressInput').val(address);
}

// Create Students

function createStudents(e) {
  let table = $('#studentTable tbody');
  let name = $('#nameInput');
  let address = $('#addressInput');

  e.preventDefault();

  const formData = {
    'name': name.val(),
    'address': address.val()
  }

  $.ajax({
    type: "POST",
    url: "http://localhost:3000/students",
    data: JSON.stringify(formData),
    dataType: "json",
    contentType: 'application/json',
    success: function (response) {
      let data = "";
      data += `<tr class="tr-${response.id}">`;
      data += "<td>" + response.id + "</td>";
      data += `<td id="name-${response.id}">` + response.name + "</td>";
      data += `<td id="address-${response.id}">` + response.address + "</td>";
      data += `<td><button class="btn btn-sm btn-primary edit-student btn-${response.id}" id="${response.id}" data-name="${response.name}" data-address="${response.address}">Edit</button>`;
      data += " <button class='btn btn-sm btn-danger delete-student' id=" + response.id + ">Delete</button></td>";
      data += "</tr>";
      table.append(data);
      name.val("");
      address.val("");
    }
  });
}

// Update Student

function updateStudent(e) {
  e.preventDefault();
  let name = $("#nameInput").val();
  let address = $('#addressInput').val();
  let id = $('#id').val();

  const formData = {
    'name': name,
    'address': address
  }

  $.ajax({
    type: "PUT",
    url: "http://localhost:3000/students/" + id,
    data: JSON.stringify(formData),
    dataType: "json",
    contentType: 'application/json',
    success: function (response) {
      $('#name-' + id).html(name);
      $('#address-' + id).html(address);

      $('.btn-' + id).attr('data-name', response.name);
      $('.btn-' + id).attr('data-address', response.address);

      $('#nameInput').val("");
      $('#addressInput').val("");
      $("#studentForm").hide();
      $("#addButton").show();
    }
  });
}

// Delete Student
function deleteStudent(student, e) {
  let id = student.attr('id')
  e.preventDefault();

  $.ajax({
    type: "DELETE",
    url: "http://localhost:3000/students/" + id,
    dataType: "json",
    contentType: 'application/json',
    success: function () {
      $('.tr-' + id).remove();
    }
  });
}

// Get Students
function loadStudents() {
  let table = $('#studentTable tbody');
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/students",
    data: "",
    dataType: "json",
    success: function (response) {
      if (response.length > 0) {
        $.each(response, function (index, value) {
          let data = "";
          data += `<tr class="tr-${value.id}">`;
          data += "<td>" + value.id + "</td>";
          data += `<td id="name-${value.id}">` + value.name + "</td>";
          data += `<td id="address-${value.id}">` + value.address + "</td>";
          data += `<td><button class="btn btn-sm btn-primary edit-student btn-${value.id}" id="${value.id}" data-name="${value.name}" data-address="${value.address}">Edit</button>`;
          data += " <button class='btn btn-sm btn-danger delete-student' id=" + value.id + ">Delete</button></td>";
          data += "</tr>";
          table.append(data);
        });
      }
    }
  });
}
