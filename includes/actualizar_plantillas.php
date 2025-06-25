<?php
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Leer el cuerpo del request como JSON
  $data = json_decode(file_get_contents("php://input"), true);

  $id = isset($data['id']) ? intval($data['id']) : 0;
  $plantillas = isset($data['plantillas']) ? explode(",", $data['plantillas']) : [];

  if ($id === 0) {
    echo json_encode(["error" => "ID de usuario inválido."]);
    exit;
  }

  // Limpiar y convertir a string
  $plantillasStr = implode(',', array_map(function($p) use ($conn) {
    return mysqli_real_escape_string($conn, $p);
  }, $plantillas));

  $sql = "UPDATE login SET plantillas = '$plantillasStr' WHERE id = $id";

  if (mysqli_query($conn, $sql)) {
    echo json_encode(["message" => "Actualización exitosa."]);
  } else {
    echo json_encode(["error" => "Error al actualizar: " . mysqli_error($conn)]);
  }

  mysqli_close($conn);
}
?>
