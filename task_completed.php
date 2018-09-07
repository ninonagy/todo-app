<?php

require "global.php";

// const send = {
//     task_id: taskId,
//     completed: !completed
// };

$conn = mysqli_connect($HOST, $USER, $PASSWORD, $DB, $PORT);
if(!$conn) {
    $result->status = "error";
    $result->message = "Can't connect to database";
} else {
    $sql = "UPDATE tasks SET completed='$post->completed'
            WHERE task_id='$post->task_id'";

    mysqli_query($conn, $sql);
}

echo json_encode($result);