<?php

// Start the session
session_start();

require "global.php";

// send = {
//     type: e.target.name,     'login' or 'signup'
//     username: this.state.user,
//     password: this.state.password
// };

if (isset($_SESSION["username"])) {
    $type = "login";
    $username = $_SESSION["username"];
    $password = $_SESSION["password"];
} else {
    if (isset($post)) {
        $type = $post->type;
        $username = $post->username;
        $password = $post->password;
    }
}

if(isset($_SESSION["username"]) || isset($post))
{
    $conn = mysqli_connect($HOST, $USER, $PASSWORD, $DB, $PORT);
    if(!$conn) {
        $result->status = "error";
        $result->message = "Can't connect to database";
    } else {
        
        $result->data = (object)[ 
            user_id => "",
            username => $username,
            focus_category_id => null
        ];

        if ($type == "login") {
            // TODO: Check if user is in db
            $sql = "SELECT user_id, password, focus_category_id
                    FROM users WHERE username='$username';";

            $query = mysqli_query($conn, $sql);

            $row = mysqli_fetch_assoc($query);
            if (!mysqli_num_rows($query) || $row["password"] != $password) {
                $result->status = "error";
                $result->message = "Wrong password or username";
            } else {
                $result->data->user_id = $row["user_id"];
                $result->data->focus_category_id = $row["focus_category_id"];
            }
        }
        else if ($type == "signup") {
            $sql = "SELECT username FROM users WHERE username='$username';";

            $query = mysqli_query($conn, $sql);
            
            if (mysqli_num_rows($query)) {
                $result->status = "error";
                $result->message = "Username already exist, please enter another one";
            } else {
                // Add user to db
                $unique_user_id = uniqid();
                $sql = "INSERT INTO users (user_id, username, password)
                        VALUES ('$unique_user_id', '$username', '$password')";
                mysqli_query($conn, $sql);

                $result->data->user_id = $unique_user_id;
            }
        }

        if (strlen($result->data->user_id)) {
            $_SESSION["username"] = $username;
            $_SESSION["password"] = $password;
        }
    }
}

echo json_encode($result);