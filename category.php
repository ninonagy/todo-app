<?php

require "global.php";

// send = {
//     user_id: this.state.userInfo.id
// };

$conn = mysqli_connect($HOST, $USER, $PASSWORD, $DB, $PORT);
if(!$conn) {
    $result->status = "error";
    $result->message = "Can't connect to database";
} else {

    // $post->user_id = "5b8d4e269030f";

    // Select all categories that user had created
    $sql = "SELECT categories.category_id, categories.name, tasks.task_id, tasks.text, tasks.completed
            FROM categories, tasks
            WHERE categories.user_id='$post->user_id' && categories.category_id=tasks.category_id;";
    $query = mysqli_query($conn, $sql);

    $result->data = (object)[
        categories => [],
    ];

    $categories = array();
    $ids = array();

    while($row = mysqli_fetch_assoc($query)) {
        $cat_id = $row["category_id"];
        $index = null;
        // echo "Current category ".$cat_id."<br>";

        // If category_id is stored in $ids
        if (in_array($cat_id, $ids)) {
            $index = array_search($cat_id, $ids);

            // echo "Found category in array with index ".$key."<br>";
        }
        else {
            // echo "Creating new category ".$cat_id."<br>";
            // Push category_id on $ids and create new category object
            $ids[] = $cat_id;
            $index = array_search($cat_id, $ids);

            $categories[] = (object)[
                id =>   $row["category_id"],
                name => $row["name"],
                tasks => []
            ];
        }

        // Add new task to that category
        $categories[$index]->tasks[] = (object)[
            id =>        $row["task_id"],
            text =>      mb_convert_encoding($row["text"], "UTF-8", "UTF-8"),
            completed => (int)$row["completed"]
        ];
    }

    $result->data->categories = $categories;
}

echo json_encode($result);