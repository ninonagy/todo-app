<?php

require "global.php";

// const send = {
//     id: taskId
// };

$conn = mysqli_connect($HOST, $USER, $PASSWORD, $DB, $PORT);
if(!$conn) {
    $result->status = "error";
    $result->message = "Can't connect to database";
} else {
    $sql = "DELETE FROM tasks WHERE tasks.task_id='$post->id'";

    mysqli_query($conn, $sql);
}

echo json_encode($result);