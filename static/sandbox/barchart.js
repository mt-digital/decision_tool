/**
 * Example bar chart for comm tool.
 */

// set single svg container width and height
var width = 600;
var height = 200;
// bar padding
var barPadding = 1;

// fake data
var dataset = [{response: "agree", frequency: .55}, 
               {response: "neutral", frequency: .1}, 
               {response: "disagree", frequency: .35}];

// create svg_1 space
var svg_1 = d3.select("#plots")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

responseWidth = 100;

padding = {top: 24};

// put in labels for rectangles
svg_1.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) { return d.response; })
   .attr("font-size", 16)
   .attr("font-family", "sans-serif")
   //.attr("font-align", "right")
   .attr("x", 0)
   .attr("y", function(d, i) { return padding.top + i*50 + 32; });
   

// put in rectangles
svg_1.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", responseWidth)
   .attr("y", function(d, i) { return padding.top + i*50; })
   .attr("fill", "dodgerblue")
   //.attr("width", 20)
   //.attr("height", 100);
   .attr("width", function(d) { return d.frequency*width; })
   .attr("height", 45);


// add text of frequency values
svg_1.selectAll("g")
   .attr("class", "data-values")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) { return d.frequency; })
   .attr("x", function(d) { return responseWidth + d.frequency*width + 10; })
   .attr("y", function(d, i) { return padding.top + i*50 + 32; });

// add title
svg_1.append("text")
   .attr("class", "plot-title")
   //.append("text")
   .text("I'm the first title")
   .attr("text-anchor", "middle")
   .attr("x", width/2.0)
   .attr("y", 20);

// create svg_2 space
var svg_2 = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

// put in labels for rectangles
svg_2.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) { return d.response; })
   .attr("font-size", 16)
   .attr("font-family", "sans-serif")
   //.attr("font-align", "right")
   .attr("x", 0)
   .attr("y", function(d, i) { return padding.top + i*50 + 32; });
   

// put in rectangles
svg_2.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", responseWidth)
   .attr("y", function(d, i) { return padding.top + i*50; })
   .attr("fill", "dodgerblue")
   //.attr("width", 20)
   //.attr("height", 100);
   .attr("width", function(d) { return d.frequency*width; })
   .attr("height", 45);


// add text of frequency values
svg_2.selectAll("g")
   .attr("class", "data-values")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) { return d.frequency; })
   .attr("x", function(d) { return responseWidth + d.frequency*width + 10; })
   .attr("y", function(d, i) { return padding.top + i*50 + 32; });

svg_2.append("text")
   .attr("class", "plot-title")
   //.append("text")
   .text("I'm the second title")
   .attr("text-anchor", "middle")
   .attr("x", width/2.0)
   .attr("y", 20);
