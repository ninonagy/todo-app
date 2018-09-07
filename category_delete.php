<?php

require "global.php";

// const send = {
//     category_id: selectedCategoryId
// }

$conn = mysqli_connect($HOST, $USER, $PASSWORD, $DB, $PORT);
if(!$conn) {
    $result->status = "error";
    $result->message = "Can't connect to database";
} else {
    $sql = "DELETE FROM categories
            WHERE categories.category_id = '$post->category_id';
            DELETE FROM tasks
            WHERE tasks.category_id = '$post->category_id';";

    mysqli_multi_query($conn, $sql);
}

echo json_encode($result);