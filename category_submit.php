<?php

require "global.php";

// send = {
//     id: newCategory.id,
//     name: newCategory.name,
//     user_id: this.state.userInfo.user_id
// };

$conn = mysqli_connect($HOST, $USER, $PASSWORD, $DB, $PORT);
if(!$conn) {
    $result->status = "error";
    $result->message = "Can't connect to database";
} else {
    $sql = "INSERT INTO categories (category_id, name, user_id)
            VALUES ('$post->id', '$post->name', '$post->user_id');
            UPDATE users SET focus_category_id='$post->id'
            WHERE user_id='$post->user_id';";
            
    mysqli_multi_query($conn, $sql);
}

echo json_encode($result);