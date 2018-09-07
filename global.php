<?php

$post = json_decode(file_get_contents("php://input"));

$result = (object)[
    status => "ok",    // 'ok' or 'error'
    message => null,   // error messages
    data => null       // query data that is returned
];

$HOST = "localhost";
$USER = "root";
$PASSWORD = "root";
$PORT = 3306;
$DB = "database";