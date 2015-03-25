function drawGraph()
{
  if(localStorage.getItem("tbRecords") === null)
  {
    alert("No records exist.");

    $(location).attr("href", "#pageMenu");
  }
  else
  {
    setupCanvas();

    var BMIarr=new Array();
    var Datearr=new Array();
    getBMIhistory(BMIarr, Datearr);

    var BMILower = new Array(2);
    var BMIUpper = new Array(2);
    getBMIbounds(BMILower,BMIUpper);

    drawLines(BMIarr, BMIUpper, BMILower, Datearr)
    labelAxes();
  }
}

function setupCanvas()
{

    var c=document.getElementById("GraphCanvas");
    var ctx=c.getContext("2d");

    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0, 0, 500, 500);

}

function getBMIhistory(BMIarr, Datearr)
{
    var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));

    tbRecords.sort(compareDates);

    for (var i=0; i < tbRecords.length; i++)
    {
      var date = new Date(tbRecords[i].Date);

      /*These methods start at 0, must increment
       * by one to compensate
       */
      var m=date.getMonth() + 1;
      var d=date.getDate() + 1;

      //The x-axis label
      Datearr[i]=(m + "/" + d);

      //The point to plot
     BMIarr[i]=parseFloat(tbRecords[i].Weight/(tbRecords[i].Height*tbRecords[i].Height));
    }
}

function getBMIbounds(BMILower, BMIUpper)
{
    //Get users cancer stage
    var user=JSON.parse(localStorage.getItem("user"));

   /*These lines show upper and lower bounds
    * of acceptable BMI levels
    */
    BMIUpper[0] = BMIUpper[1] = 25;
    BMILower[0] = BMILower[1] = 18;
}

function drawLines(BMIarr, BMIUpper, BMILower, Datearr)
{
    var BMIline=new RGraph.Line("GraphCanvas", BMIarr, BMIUpper, BMILower)
      .Set("labels", Datearr)
      .Set("colors", ["blue", "green", "red"])
      .Set("shadow", true)
      .Set("shadow.offsetx", 1)
      .Set("shadow.offsety", 1)
      .Set("linewidth", 1)
      .Set("numxticks", 6)
      .Set("scale.decimals", 2)
      .Set("xaxispos", "bottom")
      .Set("gutter.left", 40)
      .Set("tickmarks", "filledcircle")
      .Set("ticksize", 5)
      .Set("chart.labels.ingraph",
		      [, , ["BMI", "blue", "yellow", 1, 80], , ])
      .Set("chart.title", "BMI")
      .Draw();
}

function labelAxes()
{
    var c=document.getElementById("GraphCanvas");
    var ctx=c.getContext("2d");
    ctx.font="11px Georgia";
    ctx.fillStyle="green";
    ctx.fillText("Date(MM/DD)", 400, 470);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign="center";
    ctx.fillText("BMI Value", -250, 10);
}
