<?php

require "global.php";

$conn = mysqli_connect($HOST, $USER, $PASSWORD, "", $PORT);
if(!$conn) echo "Connection error.";

$sql = file_get_contents("init.sql");
if (mysqli_multi_query($conn, $sql)) {
    echo "Database '".$DB."' created successfully.";
} else {
    echo("Query error: ".mysqli_error($conn));
}