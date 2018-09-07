<?php

require "global.php";

// const send = {
//     id: newTask.id,
//     text: newTask.text,
//     category_id: this.state.selectedCategory.id
// };

$conn = mysqli_connect($HOST, $USER, $PASSWORD, $DB, $PORT);
if(!$conn) {
    $result->status = "error";
    $result->message = "Can't connect to database";
} else {
    // $encoded_text = mb_convert_encoding($post->text, "UTF-8");
    $sql = "INSERT INTO tasks (task_id, text, category_id)
            VALUES ('$post->id', '$post->text', '$post->category_id');";

    mysqli_query($conn, $sql);
}

echo json_encode($result);