$(document).ready(function(){
	var user={};
	
	function register(e){
		user.idnumber = document.getElementById('idnumber').value;
		user.firstname = document.getElementById('firstname').value;
		user.lastname = document.getElementById('lastname').value;
		user.gender = document.getElementById('gender').value;
		user.bday = document.getElementById('bday').value;
		user.program = document.getElementById('program').value;
		user.yearlevel = document.getElementById('yearlevel').value;
		$.ajax({
			type:"POST",
			data:{action:"register", userdata:user},
			url:"src/php/user.php",
			success:function(response){
				idresponse = jQuery.parseJSON(response);
				var table = $("#usertable tbody");
				if(idresponse==0){
					alert("Error saving the user!");
				}else{
					swal({
						text: "New User Account added successfully!",
						icon: "success",
						timer: 2000,
						buttons: false
					});
					user.id = idresponse;
					appendUser(user, table);
				}
				$("#userForm").find("input, select").val("");
			},
		});
		e.preventDefault();
	}

	function getUsers(){
		$.ajax({
			type:"GET",
			data:{action:"getusers"},
			url:"src/php/user.php",
			success:function(response){
				users = jQuery.parseJSON(response);
				var table = $("#usertable tbody");
				for(var i =0; i < users.length; i++){
					appendUser(users[i], table);
				}	
			},
		});
	}
	
	function appendUser(user, table){	
		row = "<tr id='"+user.id+"'>"+
				"<td scope=\"row\">" + user.id +"</td>"+
				"<td>" + user.idnumber +"</td>"+
				"<td>" + user.firstname +"</td>"+
				"<td>" + user.lastname +"</td>"+
				"<td>" + user.gender +"</td>"+
				"<td>" + user.bday +"</td>"+
				"<td>" + user.program +"</td>"+
				"<td>" + user.yearlevel +"</td>"+
				"<td>" + "<button type='button'" + "class='btn btn-primary update'" + "id='updateBTN'" + "<b>UPDATE</b>" + "</button>" + "</td>" +
		    	"<td>" + "<button type='button'" + "class='btn btn-danger delete'" + "id='"+user.id+"'" + "<b>DELETE</b>" + "</button>" + "</td>" +
			  "</tr>";		
		table.append(row);
	}
	
	$("#userForm").submit(register);
	getUsers();

/*--------------------------------------------------------------------------------------------------------------------------------------------*/
	
	$(document).on("click","#updateBTN", function(){ /*------------------Clicking-the-UPDATE-button---------------------*/
		$('#myModal').modal('show')
		$tr = $(this).closest('tr');
		var data = $tr.children('td').map(function(){
			return $(this).text();
		}).get();

		$('#id2').val(data[0]);
		$('#idnumber2').val(data[1]);
		$('#firstname2').val(data[2]);
		$('#lastname2').val(data[3]);
		$('#gender2').val(data[4]);
		$('#bday2').val(data[5]);
		$('#program2').val(data[6]);
		$('#yearlevel2').val(data[7]);
	});	


	$(document).on("click","#saveBTN", function(e){  /*------------------Clicking-the-SAVE-button---------------------*/
		var id2 = $('#id2').val();
		var idnumber2 = $('#idnumber2').val();
		var firstname2 = $('#firstname2').val();
		var lastname2 = $('#lastname2').val();
		var gender2 = $('#gender2').val();
		var bday2 = $('#bday2').val();
		var program2 = $('#program2').val();
		var yearlevel2 = $('#yearlevel2').val();
		$.ajax({
			type:"POST",
			data:{action:"update", id2:id2, idnumber2:idnumber2, firstname2:firstname2, lastname2:lastname2, gender2:gender2, bday2:bday2, program2:program2, yearlevel2:yearlevel2},
			url:"src/php/user.php",
			success:function(response){
				if(response.error){
					swal({
						text: "Opps... failed to update the user account!",
						icon: "error",
						timer: 3000,
						buttons: false
					});
					setTimeout(function(){location.href="index.html"} , 1500); 
				}
				else{
					swal({
						text: "User Account updated successfully!",
						icon: "success",
						timer: 3000,
						buttons: false
					});
					setTimeout(function(){location.href="index.html"} , 1500); 
				}
			},
		});
		e.preventDefault();
   	});    
	
	
		$(document).on("click","#closeBTN", function(){  /*------------------Clicking-the-CLOSE-button---------------------*/
		$('#myModal').modal('hide')
	});


	$(document).on("click",".delete",function(e){ /*------------------Clicking-the-DELETE-button---------------------*/
		var id = $(this).attr("id");
		swal({
			title: "Think Twice!",
			text: "It will not be undone once deleted!",
			icon: "warning",
			buttons: ["NO", "YES"],
			dangerMode: true,
		})
		.then((willDelete) => {
			if(willDelete){
				$(this).closest('tr').remove();
				$.ajax({
					type:"POST",
					data:{action:"delete", id:id},
					url:"src/php/user.php",
					success:function(response){
						if(response.error){
							swal({
								text: "Opps... failed to delete the user account!",
								icon: "error",
								timer: 3000,
								buttons: false
							});
						}
						else{
							swal({
								text: "User Account deleted successfully!",
								icon: "success",
								timer: 3000,
								buttons: false
							});
						}
					},
				});
			}else {
				swal({
					text: "The user account is safe!",
					timer: 2000,
					buttons: false
				});
			}
		});
		e.preventDefault();
	});

});








