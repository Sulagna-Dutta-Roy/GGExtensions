<?php 

// Specify the folder where files will be uploaded
$folder = "uploads/";

// Move the uploaded file to the specified folder
// $_FILES['file']['tmp_name'] is the temporary file name
// $_FILES['file']['name'] is the original file name
move_uploaded_file($_FILES['file']['tmp_name'], $folder . time() . '_' . $_FILES['file']['name']);