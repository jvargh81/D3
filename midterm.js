async function main(){
  var w=500;
  var h=500;
  var padding=60;  
  var yValue=440;

  var svg = d3.select("body")
              .append("svg")
              .attr("width",w)
              .attr("height",h)
 
  var salary = await d3.csv("salaries.csv");

  /* Parsing integer strings to integer. */
  salary = salary.map(d=>({
              name: d["name"],
              year: parseInt(d["yearID"]),
              salaries: parseInt(d["Salaries"]) * 0.00000001
          }));
              
  /* Preparing the opening page. */   
  var dataset = salary.filter(d=>d["name"]=="Anaheim Angels");
  var size = dataset.length;
  console.log(size)
 
  for(i=size;i<32;i++){
    dataset.push(", ")
  }

  svg.append("text")
    .attr("x",180)
    .attr("y",15)
    .text("MLB Payrolls Over the Years")
    .attr("font-size",20)
    .attr("text-anchor","middle")

  svg.append("text")
    .attr("x",180)
    .attr("y",35)
    .text("Select the team, then click on the year to see the payroll")
    .attr("font-size",12)
    .attr("text-anchor","middle")

  var ymin = 0;
  var ymax = 240;
  var xmin = 0;
  var xmax = 480;

  var xScale = d3.scaleLinear()
                  .domain([xmin,xmax])
                  .range([15+padding,w-padding]);
  
  var yScale = d3.scaleLinear()
                  .domain([ymax,ymin])
                  .range([0+padding,h-padding]);
          
  var yAxis = d3.axisLeft()
                .scale(yScale);
  
  svg.append("g")
      .attr("class","yaxis")
      .attr("transform","translate("+padding+",0)")
      .call(yAxis);
  
  svg.append("text")
      .data(dataset)
      .attr("class","title")
      .attr("x",300)
      .attr("y",100)
      .text(function(d){return d["name"]})
      .attr("font-size",12)

 circle =  svg.append("circle")
      .attr("class","circles")
      .attr("cx",60)
      .attr("cy",yValue)
      .attr("r",4)
      .attr("fill","transparent")
      .attr("stroke","black")
            
  years = svg.selectAll('text.years')
      .data(dataset)
      .enter()
      .append("text")
      .classed('years', true)	
      .attr("cursor","pointer")
      .text(function(d){return d.year})
      .attr("x", function(d,i){return xScale(100 * (i % 2))})
      .attr("y",function(d,i){return yScale(10 * (Math.floor(i/2)))})
      .attr("font-size",12)
      .on("click", function(d){
          circle
            .transition()
            .delay(100)
            .ease(d3.easeBounce)
            .duration(2000)
            .attr("cy",yScale(d["salaries"]))
            .attr("fill","red")
            .transition()
            .delay(100)
            .attr("fill","transparent")
            })
            
  

  d3.selectAll("option")
      /*Click Functionality */
      .on("click", function(){ 
        dataset = salary.filter(d=>d["name"]==this.value);
        var size = dataset.length;
        console.log(dataset)
        d3.select(".title")
          .text(this.value)
        
        for(i=size;i<32;i++){
            dataset.push(", ")
          }

        years
            .data(dataset)
            .text(function(d){return d["year"]})
            .attr("x", function(d,i){return xScale(100 * (i % 2))})
            .attr("y",function(d,i){return yScale(10 * (Math.floor(i/2)))})
        })                
}

main();