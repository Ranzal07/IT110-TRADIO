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
					swal({
						text: "Opps... failed to add the user account!",
						icon: "error",
						timer: 2500,
						buttons: false
					});
				}else{
					swal({
						text: "New User Account added successfully!",
						icon: "success",
						timer: 1500,
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
		row = "<tr>"+
				"<td scope=\"row\">" + "<b>" + user.id + "</b>" + "</td>"+ 
				"<td>" + user.idnumber +"</td>"+
				"<td>" + user.firstname +"</td>"+
				"<td>" + user.lastname +"</td>"+
				"<td>" + user.gender +"</td>"+
				"<td>" + user.bday +"</td>"+
				"<td>" + user.program +"</td>"+
				"<td>" + user.yearlevel +"</td>"+
				"<td>" + "<button type='button'" + "class='btn btn-primary update'" + "id='updateBTN'" + "<b>UPDATE</b>" + "</button>" + "</td>" +
		    	"<td>" + "<button type='button'" + "class='btn btn-danger delete'" + "id='deleteBTN'" + "<b>DELETE</b>" + "</button>" + "</td>" +
			  "</tr>";		
		table.append(row);
	}
	
	$("#userForm").submit(register);
	getUsers();

/*--------------------------------------------------------------------------------------------------------------------------------------------*/
	var this_row = null; /*<-----Used-as-a-global-variable-to-get-the-selected-row::*/
	
	$(document).on("click","#updateBTN", function(e){ /*------------------Clicking-the-UPDATE-button---------------------*/
		this_row = $(this).closest('tr'); /*<-----Get-the-selected-row-under-clicking-the-UPDATE-button::*/

		var data = this_row.children('td').map(function(){
			return $(this).text();
		}).get();

		$('#myModal').modal('show')
		
		$('#id2').val(data[0]);
		$('#idnumber2').val(data[1]);
		$('#firstname2').val(data[2]);
		$('#lastname2').val(data[3]);
		$('#gender2').val(data[4]);
		$('#bday2').val(data[5]);
		$('#program2').val(data[6]);
		$('#yearlevel2').val(data[7]);

		e.preventDefault();
	});	
	
	$(document).on("click","#saveBTN", function(e){  /*------------------Clicking-the-SAVE-button---------------------*/
		var user2={};

		user2.id2 = $('#id2').val();
		user2.idnumber2 = $('#idnumber2').val();
		user2.firstname2 = $('#firstname2').val();
		user2.lastname2 = $('#lastname2').val();
		user2.gender2 = $('#gender2').val();
		user2.bday2 = $('#bday2').val();
		user2.program2 = $('#program2').val();
		user2.yearlevel2 = $('#yearlevel2').val();
		
		$.ajax({
			type:"POST",
			data:{action:"update", user2:user2},
			url:"src/php/user.php",
			success:function(response){
				if(response.error){
					swal({
						text: "Opps... failed to update the user account!",
						icon: "error",
						timer: 1500,
						buttons: false
					});
				}else{
					$(this_row).find('td:eq(1)').text(user2.idnumber2);
					$(this_row).find('td:eq(2)').text(user2.firstname2);
					$(this_row).find('td:eq(3)').text(user2.lastname2);
					$(this_row).find('td:eq(4)').text(user2.gender2);
					$(this_row).find('td:eq(5)').text(user2.bday2);
					$(this_row).find('td:eq(6)').text(user2.program2);
					$(this_row).find('td:eq(7)').text(user2.yearlevel2);
					
					swal({
						text: "User Account updated successfully!",
						icon: "success",
						timer: 1500,
						buttons: false
					});
					$('#myModal').modal('hide');
					this_row = null;
				}
			},
		});
		e.preventDefault();
   	});    

	   
	
		$(document).on("click","#closeBTN", function(){  /*------------------Clicking-the-CLOSE-button---------------------*/
		$('#myModal').modal('hide');
	});


	$(document).on("click",".delete",function(e){ /*------------------Clicking-the-DELETE-button---------------------*/
		this_row = $(this).closest('tr'); /*<-----Get-the-selected-row-under-clicking-the-DELETE-button::*/

		var data = this_row.children('td').map(function(){
			return $(this).text();
		}).get();
		
		$('#id2').val(data[0]);
		var id = $('#id2').val();
		
		swal({
			title: "THINK TWICE!",
			text: "It will not be undone once deleted!",
			icon: "warning",
			buttons: ["NO", "YES"],
			dangerMode: true,
		})
		.then((willDelete) => {
			if(willDelete){
				$.ajax({
					type:"POST",
					data:{action:"delete", id:id},
					url:"src/php/user.php",
					success:function(response){
						if(response.error){
							swal({
								text: "Opps... failed to delete the user account!",
								icon: "error",
								timer: 1500,
								buttons: false
							});
						}else{
							this_row.remove();
							swal({
								text: "User Account deleted successfully!",
								icon: "success",
								timer: 1500,
								buttons: false
							});
							checkUsers();
						}
						this_row = null;
					},
				});
			}else{
				swal({
					text: "The user account is safe!",
					timer: 1500,
					buttons: false
				});
			}
		});
		e.preventDefault();
	});

	function checkUsers(){
		$.ajax({
			type:"GET",
			data:{action:"checkusers"},
			url:"src/php/user.php",
			success:function(response){
				console.log(response);
			},
		});
	}

});