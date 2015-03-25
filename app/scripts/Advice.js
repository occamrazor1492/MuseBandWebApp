function advicePage()
{
  if (localStorage.getItem("tbRecords") === null)
  {
    alert("No records exist.");

    $(location).attr("href", "#pageMenu");
  }
  else
  {

    var user=JSON.parse(localStorage.getItem("user"));

    var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
    tbRecords.sort(compareDates);

    var i=tbRecords.length-1;
	var rec=tbRecords[i];
    var BMI=rec.Weight/(rec.Height*rec.Height);

    var c=document.getElementById("AdviceCanvas");
    var ctx=c.getContext("2d");
    ctx.fillStyle="#c0c0c0";
    ctx.fillRect(0,0,550,550);
    ctx.font="22px Arial";
    drawAdviceCanvas(ctx,BMI);

  }
}

function drawAdviceCanvas(ctx,BMI)
{
  ctx.font="22px Arial";
  ctx.fillStyle="black";
  ctx.fillText("Your current BMI is " + BMI + ".", 25, 320);
  BmiWrite(ctx,BMI);
  BmiMeter(ctx,BMI);
}

//For deciding what to BmiWrite for given values of BMI level A
function BmiWrite(ctx,BMI)
{
  if ((BMI >= 18) && (BMI <= 25))
  {
      writeAdvice(ctx,"green");
  }
  else if ((BMI < 18))
  {
      writeAdvice(ctx,"yellow");
  }
  else if (((BMI > 25) && (BMI <= 30)))
  {
      writeAdvice(ctx,"red");
  }
  else
  {
      writeAdvice(ctx,"blue");
  }
}


function writeAdvice(ctx,level)
{
  var adviceLine1="";
  var adviceLine2="";

  if(level=="#000000")
  {
    adviceLine1="Obesity";

  }
  else if(level=="yellow")
  {
    adviceLine1="Malnutrition";

  }
  else if(level=="red")
  {
    adviceLine1="Overweight";

  }
  else if(level="green")
  {
    adviceLine1="Perfect";

  }
  ctx.fillText("BMI-level :" + level +".", 36, 380);
  ctx.fillText("Status:" + adviceLine1, 36, 410);

}


function BmiMeter(ctx,BMI)
{
  if (BMI <= 40)
  {
    var ccg=new RGraph.CornerGauge("AdviceCanvas", 0, 40, BMI)
      .Set("chart.colors.ranges", [[30.1,40,"#000000"], [25.1, 30,"red"], [18.1, 25, "#0f0"], [0.0,18,"yellow"]]);
  }
  drawMeter(ccg);
}

// BmiMeter properties
function drawMeter(g)
{
  g.Set("chart.value.text.units.post", " kg/m^2")
    .Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 2)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 2)
    .Set("chart.title", "BMI LEVEL")
    .Set("chart.radius", 250)
    .Set("chart.centerx", 50)
    .Set("chart.centery", 250)
    .Draw();
}
