console.log('This script is started and it will neva give up');


$('#send').click(()=>{
	let value = $('#path').val();
	$.post('/tree',{
		path: value,
	},(data,status)=>{
		$('#container').empty();
		appender(data,$('#container'));
	})
})
function appender(data,context){
 //appender function start
	for(let i = 0; i < data.length; i++){
		if(data[i] instanceof Object){
			context.append(`<div class="block"><img src="img/closed-folder.png">${Object.keys(data[i])[0]}<img src="img/delete.png" class="delete"></div>`);
			context.children().last().children().last().click(function(){
				if(event.target !== event.currentTarget) return;
				let path = pathFinder($(this))
				let result = prompt(`Are you sure you want to delete this folder??\n ${path} `,'');
				if(result === 'yes'){
					$.post('/deletefolder',{
						value: path,
					},(data,status)=>{
						if(status === 'success'){
							$(this).parent().remove();
							alert('Folder succesfully deleted')
						}else if(status === 'notmodified'){
							let result = prompt('This folder is not empty. Do you still want to delete it?','');
							if(result === 'yes');
							$.post('/deletefolderdemand',{
								value: path,
							},(data,status)=>{
								if(status === 'success'){
									$(this).parent().remove();
									alert('Folder succesfully deleted');
								}
							})
						}
					})
				}
			})
			context.children().last().click(function(){
				if(event.target !== event.currentTarget) return;
				if($(this).css('height') == '35px'){
					$(this).css('height','auto');
					$(this).children().first().attr('src','img/open-folder.png')
				}else{
					$(this).css('height','35px');
					$(this).children().first().attr('src','img/closed-folder.png');
				}
			})
			context.children().last().append('<img src="img/fileAdd.png">')
			context.children().last().children().last().click(function(){
					if(event.target !== event.currentTarget) return;
					let result = prompt('Filename to create')
					let path = pathFinder($(this));
					$.post('/make',{
						value: result,
						path: path,
					},(data,status)=>{
						if(status === 'success'){
							alert('File succesfully created');
							appender([result],$(this).parent());
						}else if(status === 'notmodified'){
							let demand = prompt('File already exists. Do you want to overwrite it??','');
							if(demand = 'yes'){
								$.post('/makedemand',{
									value: result,
									path: path,
								},(data,status)=>{
									if(status === 'success'){
										alert('File has been overwritten')
									}
								})
							}
						}
					})
			});
			context.children().last().append('<img src="img/folderAdd.png">'); //making directory
			context.children().last().children().last().click(function(){
				if(event.target !== event.currentTarget) return;
				let result = prompt('Folder name to create')
				if(result === null) return;
				let path = pathFinder($(this));
				let self = this;
				$.post('/makefolder',{
					value: result,
					path: path,
				},function(data,status){
					if(status === 'success'){
						alert('Folder has been created');
						let obj={}
						let arr =[];
						Object.defineProperty(obj,data+'',{value: []});
						//obj[Object.keys(obj)[0]]=[];
						arr.push(obj);
						let test = [{
							'KAREN':[],
						}]
						appender(data,$(self).parent()); //[{'result':[]}] //bug
					}
				})
			})
			appender(data[i][Object.keys(data[i])[0]],context.children().last()); //plz dont kill me for this line
		}else{
			context.append(`<div class="block"><img src="img/file.png">${data[i]}<img src="img/delete.png"></div>`);
			context.children().last().children().last().click(function(){
				if(event.target !== event.currentTarget) return;
				let path = pathFinder($(this));
				let result = prompt(`Are you sure you want to delete this file??\n ${path}`,'');
				if(result === 'yes'){
					$.post('/delete',{
						value: path,
					},(data,status)=>{
						if(status === 'success'){
							$(this).parent().remove();
							alert('File succesfully deleted')
						}else{
							alert('Invalid path/no such file')
						}
					})
				}
			})
		}
	}
}         //appender function end

function pathFinder(context){
	if(context.parent().parent().contents().get(1).nodeValue === null){
		return $('#path').val()+ '/' + context.parent().contents().get(1).nodeValue.toString()
	}else{
		return (pathFinder(context.parent()) + '/' + context.parent().contents().get(1).nodeValue);
	}
}
