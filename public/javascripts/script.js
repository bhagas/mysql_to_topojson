// JavaScript Document

//call this function when click on remove link  
function removeData(val){
	var parent = val.parentNode.parentNode;	
	var id = parent.id;
	
	$.ajax({
			url: "/"+id,
			type: "GET", 
			/*success: function(){ 
			//console.log("data : "+ data );
			//total();
			}*/
		});
	
}

//call this function when click on edit link  
function editData(val){
	var parent = val.parentNode.parentNode;	
	var id = parent.id;
	
   $(document).ready(function(e) {
	   $('.addT').css("display","none");
		$('.updateT').css("display","block");
		
	   var name = $("tr#"+id+" td.name").text();
	   var price = $("tr#"+id+" td.price").text();
	   var qty = $("tr#"+id+" td.qty").text();	   
	   
	   $('#txtnm1').val(name);
	   $('#txtprice1').val(price);
	   $('#txtqty1').val(qty);
	   $('#hide').val(id);  
   });
	
}

$(document).ready(function(e) {
	
	var socket = io.connect('http://node.cv-sip.id:800', { forceNew:true, 'multiplex':false }); // socket connection 
	
	// calculate total price of all items
	function total(){	
		var length = $(".container tr").length;		
		var i,total = 0;
		
		for(i=1;i<=length+1;i++){
			
			var price = $(".container tr:nth-child("+i+") td.price").text();
			var qty = $(".container tr:nth-child("+i+") td.qty").text();
			total = total + Number(price)*Number(qty);			 	
		}
		
		$("div.total").text("Total Price:"+total);				
	}
	
	// get item data from socket
	socket.on('item', function (data) {
		var items = data.msg;
		
			var i =0;
			// append item into table
			$(".container").append("<tr id='"+items[i]._id+"'><td class='name'>"+items[i].name+"</td><td class='price'>"+items[i].price+"</td><td class='qty'>"+items[i].qty+"</td><td><a href='#' onclick='removeData(this)' data="+items[i]._id+" class='btnRemove'>Remove</a></td><td><a i="+i+" data="+items[i]._id+" href='#' onclick='editData(this)'>Edit</a></td></tr>");
		
			total();	
});
   
   // get updated item data from socket
   socket.on('update', function (data) {
		var item = data.item;
		var id = item[0]._id;
		
		// change item details from table
		$("tr#"+id+" td.name").text(item[0].name);
		$("tr#"+id+" td.price").text(item[0].price);
		$("tr#"+id+" td.qty").text(item[0].qty); 
		
		total();
		 
   });
	
   // get id from socket	
   socket.on('id', function (data) {
	   var id = data.id;
	   $("tr#"+id).remove(); // remove table row for this item id 
	   
	   total();
   });   
	
	//call this function when click on add button 
	$('#add').click(function(e) {
		var formData = $('#form1').serialize(); // retrieve submited data from form.
        $.post('/add',formData,function(data){
			if(data){
			   $('#txtnm').val("");
			   $('#txtprice').val("");
			   $('#txtqty').val("");
			}
			else{				
				  alert("Enter Value In Proper Format."); // show alert box if respose is false
			}
		});
    });
	
	//call this function when click on update button 
 	$('#update').click(function(e) {
       var id = $('#hide').attr("value");
		$('.addT').css("display","block");
		$('.updateT').css("display","none");
		var formData = $('#form2').serialize();  // retrieve submited data from form.
		$.post("/edit/"+id ,formData,function(data){
			if(data){
			}
			else{
				  alert("Enter Value In Proper Format.");	// show alert box if respose is false
			}
		});
		
    });
	
	//call this function when click on cancel button 
	$('#cancel').click(function(e) {
		$('.addT').css("display","block");
		$('.updateT').css("display","none");			
	});
	
});