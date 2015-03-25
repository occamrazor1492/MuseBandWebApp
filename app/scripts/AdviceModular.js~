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
    var TSHLevel=user.TSHRange;
    
    var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
    tbRecords.sort(compareDates);
    var i=tbRecords.length-1;
    var TSH=tbRecords[i].TSH;
    
    var c=document.getElementById("AdviceCanvas");
    var ctx=c.getContext("2d");
    ctx.fillStyle="#c0c0c0";
    ctx.fillRect(0,0,550,550);
    ctx.font="22px Arial";
    drawAdviceCanvas();
    
    // Nested functions start here
    function drawAdviceCanvas()
    {
      if (TSHLevel == "StageA")
      {
        stageAwrite();
        ctx.fillText("Your target TSH range is: 0.01-0.1 mlU/L", 25, 350); 
        stageAMeter();
      }
      else if (TSHLevel == "StageB")
      {    
        stageBwrite();
        ctx.fillText("Your target TSH range is: 0.1-0.5 mlU/L", 25, 350);
        stageBMeter();
      }
      else if (TSHLevel == "StageC")
      {
        stageCwrite();
        ctx.fillText("Your target TSH range is: 0.35-2.0 mlU/L", 25, 350);
        stageCMeter();
      }
    }

    function writeAdvice(level)
    {
      var adviceLine1="";
      var adviceLine2="";

      if(level=="red")
      {
        adviceLine1="Please consult with your family";
        adviceLine2="physician urgently."; 
      }
      else if(level=="yellow")
      {
        adviceLine1="Contact family physician and recheck bloodwork";
        adviceLine2="in 6-8 weeks.";
      }
      else if(level="green")
      {
        adviceLine1="Repeat bloodwork in 3-6 months.";
      }
      ctx.font="22px Arial";
      ctx.fillStyle="black";
      ctx.fillText("Your TSH-level is " + TSH+".", 25, 320);
      ctx.fillText(adviceLine1, 25, 380);
      ctx.fillText(adviceLine2, 25, 410);      
    }
  
    //For deciding what to write for given values of TSH stage A
    function stageAwrite()
    {
      if ((TSH >= 0.01) && (TSH <= 0.1)) 
      {
          writeAdvice("green");
      }
      else if ((TSH > 0.1) && (TSH <= 0.5)) 
      {
          writeAdvice("yellow");
      }
      else 
      {
          writeAdvice("red");
      }
    }

    function stageBwrite()
    {
      if ((TSH >= 0.1) && (TSH <= 0.5))
      {
        writeAdvice("green");
      }
      else if ((TSH > 0.5) && (TSH <= 2.0))
      {
        writeAdvice("yellow");
      }
      else if ((TSH >= 0.01) && (TSH < 0.1))
      {
        writeAdvice("yellow");
      }
      else
      {
        writeAdvice("red");
      }
    }
           
    function stageCwrite()
    {
      if ((TSH >= 0.35) && (TSH <= 2.0))
      {
        writeAdvice("green");
      }
      else if ((TSH > 2) && (TSH <= 10))
      {
        writeAdvice("yellow");
      }
      else if ((TSH >= 0.1) && (TSH < 0.35))
      {
        writeAdvice("yellow");
      }
      else 
      {
        writeAdvice("red");
      }
    }

    // Meter properties
    function drawMeter(g)
    {
      g.Set("chart.value.text.units.post", " mlU/L")
        .Set("chart.value.text.boxed", false)
        .Set("chart.value.text.size", 14)
        .Set("chart.value.text.font", "Verdana")
        .Set("chart.value.text.bold", true)
        .Set("chart.value.text.decimals", 2)
        .Set("chart.shadow.offsetx", 5)
        .Set("chart.shadow.offsety", 5)
        .Set("chart.scale.decimals", 2)
        .Set("chart.title", "TSH LEVEL")
        .Set("chart.radius", 250)
        .Set("chart.centerx", 50)
        .Set("chart.centery", 250)
        .Draw();
    }

    function stageAMeter()
    {
      var cg=new RGraph.CornerGauge("AdviceCanvas", 0, 3, TSH)
        .Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5, "yellow"], [0.01, 0.1, "#0f0"]]);
      
      drawMeter(cg);
      
      //If TSH value is huge
      if (TSH > 3)
      {
        var cg=new RGraph.CornerGauge("AdviceCanvas", 0,TSH,TSH)
          .Set("chart.colors.ranges", [[0.5, 3, "red"], [0.1, 0.5, "yellow"], [0.01, 0.1, "#0f0"], [3.01, TSH, "red"]]);
          drawMeter(cg);
      }
    } 

    function stageBMeter()
    {
      var bcg=new RGraph.CornerGauge("AdviceCanvas", 0, 3, TSH)
        .Set("chart.colors.ranges", [[2.01, 3, "red"], [0.51, 2, "yellow"], [0.1, 0.5, "#0f0"], [0.01, 0.1, "yellow"]]);
      drawMeter(bcg);
      
      //If TSH value is huge
      if (TSH > 3)
      {
        var bcg=new RGraph.CornerGauge("AdviceCanvas", 0, TSH, TSH)
          .Set("chart.colors.ranges", [[2.01, 3, "red"], [0.51, 2,"yellow"], [0.1, 0.5, "#0f0"], [0.01, 0.1, "yellow"], [3, TSH, "red"]]);
        drawMeter(bcg);
      }
    }
     
    function stageCMeter()
    {
      var ccg=new RGraph.CornerGauge("AdviceCanvas", 0, 15, TSH)
        .Set("chart.colors.ranges", [[10.01, 15, "red"], [2.01, 10,"yellow"], [0.35, 2, "#0f0"], [0.1,.34,"yellow"]]);
      drawMeter(ccg);

      //If TSH value is huge
      if (TSH > 15)
      {
        var ccg=new RGraph.CornerGauge("AdviceCanvas", 0, TSH, TSH)
          .Set("chart.colors.ranges", [[10.01, 15, "red"], [2.01, 10, "yellow"], [0.35, 2, "#0f0"], [0.1, 0.34, "yellow"], [15.01, TSH, "red"]]);
        drawMeter(ccg);
      }
    }

    //Nested functions end here
  }
}
