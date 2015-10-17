function init() {
	console.log("here");
      var canvas = document.getElementById("game_canvas");
      if (canvas.getContext) {
        var context = canvas.getContext('2d');
        img = new Image();
        img1 = new Image();
        img2 = new Image();
        img.onload = function(){
        	context.drawImage(img,0,0);
        	context.drawImage(img1, 75, 110, 50, 38, 50, 20, 115, 50);
        	context.drawImage(img2, 120, 100, 50, 50, 130, 10, 100, 50);
        };
        img.src = './duckhunt-background.gif';
        img1.src = './duckhunt_various_sheet.png';
        img2.src = './duckhunt_various_sheet.png';
    }
}