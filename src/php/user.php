<?php 
	require ('conn.php');

	if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action']=="register"){
		$pdo->beginTransaction();
		try {
			$sql = 'INSERT INTO user(idnumber, firstname, lastname, gender, bday, program, yearlevel) VALUES(:idnumber, :firstname, :lastname, :gender, :bday, :program, :yearlevel)';
			$statement = $pdo->prepare($sql);
			$statement->execute([
				':idnumber' => $_POST['userdata']['idnumber'],
				':firstname' => $_POST['userdata']['firstname'],
				':lastname' => $_POST['userdata']['lastname'],
				':gender' => $_POST['userdata']['gender'],
				':bday' => $_POST['userdata']['bday'],
				':program' => $_POST['userdata']['program'],
				':yearlevel' => (int) $_POST['userdata']['yearlevel'],
			]);

			echo $pdo->lastInsertId();
			$pdo->commit();
		} catch (Exception $e) {
			$pdo->rollback();
		}
	}

	else if($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action']=="getusers"){
		$sql = "SELECT * FROM user";
		$statement = $pdo->query($sql);
		$users = $statement->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($users);
	
	}

	else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action']=="update"){
		$id2 = $_POST['id2'];
		$idnumber2 = $_POST['idnumber2'];
		$firstname2 = $_POST['firstname2'];
		$lastname2 = $_POST['lastname2'];
		$gender2 = $_POST['gender2'];
		$bday2 = $_POST['bday2'];
		$program2 = $_POST['program2'];
		$yearlevel2 = $_POST['yearlevel2'];

		$sql = "UPDATE user SET idnumber='$idnumber2', firstname='$firstname2', lastname='$lastname2', gender='$gender2', bday='$bday2', program='$program2', yearlevel='$yearlevel2' WHERE id = '".$id2."'";
		$statement = $pdo->prepare($sql);
		$statement->execute();

	}

	else if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action']=="delete"){
		$id  = $_POST['id'];

   		$sql = "DELETE FROM user WHERE id = '".$id."'";
		$statement = $pdo->query($sql);
		$statement->execute();
	}

 ?>

 