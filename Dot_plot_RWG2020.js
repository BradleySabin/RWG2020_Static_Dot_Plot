// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 110},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    data;                                 

//manual legend
legendSVG = d3.select("#legend")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 30)
    
    legendSVG.append("circle")
        .attr("cx",300)
        .attr("cy",20)
        .attr("r", 5)
        .style("fill", "#f78c01")

    legendSVG.append("circle")
        .attr("cx",400)
        .attr("cy",20)
        .attr("r", 5)
        .style("fill", "#2fbec7")

    legendSVG.append("text")
        .attr("x", 310)
        .attr("y", 20)
        .text("Women")
        .attr("alignment-baseline","middle")
        .attr("font-family", "arial")
        .attr("font-size","14px")
        .attr("fill", "#57595D")

    legendSVG.append("text")
        .attr("x", 410)
        .attr("y", 20)
        .text("Men")
        .attr("alignment-baseline","middle")
        .attr("font-family", "arial")
        .attr("font-size","14px")
        .attr("fill", "#57595D")


// append the svg object to the body of the page
var svg = d3.select("#myChart")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform","translate(" + margin.left + "," + margin.top + ")")

// Parse the Data
d3.csv("DotPlot_Race.csv", function(data) {

    dataset = data

    //converting measures 
    dataset.forEach(function(d) {
        d.Race = d.Race; //no change
        d.Controlled_white_m = +d.Controlled_white_m; //numeric
        d.Controlled_white_formatted_w = +d.Controlled_white_formatted_w; //numeric
        d.Controlled_white_formatted_m = +d.Controlled_white_formatted_m; //numeric
        d.Controlled_white_w = +d.Controlled_white_w; //numeric
    });

    //sorting data by men's controlled $
    dataset.sort(function(a, b) {
               return d3.descending(a.Controlled_white_m, b.Controlled_white_m);
      });


      // Add X axis
      var x = d3.scaleLinear()
           .domain([d3.min(dataset, function(d) {return +d.Controlled_white_m;})-0.02, d3.max(dataset, function(d) {return d.Controlled_white_m;})+0.01])
        .range([ 0, width])
      
      svg.append("g")
          .attr("class","xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom()
                .scale(x)
                .ticks(7)
                .tickFormat(d3.format("$.2f")) //currency format
                .tickSizeOuter(0) //no outer ticks
            )
    //update color of x Axis Labels	
    d3.selectAll("g.tick")
        .selectAll("text")
        .attr("fill","#57595D")

       // Y axis
       var y = d3.scaleBand()
        .range([0, height])
        .domain(dataset.map(function(d) { return d.Race; }))
        .padding(1);

      svg.append("g")
          .attr("class","yaxis")
        .call(d3.axisLeft()
                .scale(y)
            )
    //update color of y Axis Labels	
    d3.selectAll("g.tick")
        .selectAll("text")
        .attr("fill","#57595D")	

    // Reference line
      svg.selectAll("myline")
        .data(dataset)
        .enter()
        .append("line")
              .attr("y1", 20)
              .attr("y2", height)
              .attr("x1", 304)
              .attr("x2", 304)
              .style("stroke-dasharray", ("3, 3"))
              .attr("stroke", "#57595D")
              .attr("stroke-width", "1px")

      // Lines
     svg.selectAll("myline")
           .data(dataset)
        .enter()
        .append("line")
              .attr("x1", function(d) { return x(d.Controlled_white_w); })
              .attr("x2", function(d) { return x(d.Controlled_white_m); })
              .attr("y1", function(d) { return y(d.Race); })
              .attr("y2", function(d) { return y(d.Race); })
              .attr("stroke", "grey")
              .attr("stroke-width", "1px")

    

      // Circles of Women
      svg.selectAll("mycircle")
        .data(dataset)
        .enter()
        .append("circle")
              .attr("cx", function(d) { return x(d.Controlled_white_w); })
              .attr("cy", function(d) { return y(d.Race); })
              .attr("r", "8")
              .style("fill", "#f78c01")
            .on("mouseover", function(d) {
                   
                   //change the color of the circle
                   d3.select(this)
                       .style("fill", "#ffcb44")

                   //determine tooltip info/location
                   d3.select("#tooltip")
                    .style("left", (d3.event.pageX -5) + "px")		
                    .style("top", (d3.event.pageY - 70) + "px")
                    .select("#value")
                        .text(d.Controlled_white_w)

                d3.select("#tooltip")
                    .style("left", (d3.event.pageX -5) + "px")		
                    .style("top", (d3.event.pageY -70) + "px")
                    .select("#TooltipTitle")
                        .text(d.Race + " Women")	

                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);

            })
            .on("mouseout", function() {
                   d3.select(this)
                       .style("fill", "#f78c01")
                    //Hide the tooltip
                    d3.select("#tooltip").classed("hidden", true);
            })

      // Circles of Men
      svg.selectAll("mycircle")
        .data(dataset)
        .enter()
        .append("circle")
              .attr("cx", function(d) { return x(d.Controlled_white_m); })
              .attr("cy", function(d) { return y(d.Race); })
              .attr("r", "8")
              .style("fill", function(d){
                  if (d.Controlled_white_m == 1) {return "#57595D"}
                else { return "#2fbec7" }
            })
              .on("mouseover", function(d) {
                   
                   //change the color of the circle
                   d3.select(this)
                       .style("fill", "#5edee4")

                   //determine tooltip Value
                   d3.select("#tooltip")
                    .style("left", (d3.event.pageX - 5) + "px")		
                    .style("top", (d3.event.pageY - 70) + "px")
                    .select("#value")
                        .text(d.Controlled_white_m)

                //determine tooltip title
                d3.select("#tooltip")
                    .style("left", (d3.event.pageX -5) + "px")		
                    .style("top", (d3.event.pageY - 70) + "px")
                    .select("#TooltipTitle")
                        .text(d.Race + " Men")


                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);

            })
            .on("mouseout", function() {
                   d3.select(this)
                       .style("fill", function(d){
                          if (d.Controlled_white_m == 1) {return "#57595D"}
                        else { return "#2fbec7" }
                    })
                    //Hide the tooltip
                    d3.select("#tooltip").classed("hidden", true);
            })

})