<?php

require "global.php";

// const send = {
//     focus_category_id: category.id,
//     user_id: this.state.userInfo.user_id
// }

$conn = mysqli_connect($HOST, $USER, $PASSWORD, $DB, $PORT);
if(!$conn) {
    $result->status = "error";
    $result->message = "Can't connect to database";
} else {
    $sql = "UPDATE users SET focus_category_id='$post->focus_category_id' WHERE user_id='$post->user_id'";
    mysqli_query($conn, $sql);
}

$result->data = $post->focus_category_id;

echo json_encode($result);