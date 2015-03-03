/**
 * Example bar chart for comm tool.
 */
// set single svg container width and height
var width = 600;
var height = 250;

// bar padding
var barPadding = 1;

// fake data
var onecounty_data = {
  question: "I like Ice Cream",
    region_responses: [
      {region: "Latah",
       responses: [{response: "strongly agree", frequency: .2},
                   {response: "somewhat agree", frequency: .55}, 
                   {response: "neutral", frequency: .1}, 
                   {response: "somewhat disagree", frequency: .35},
                   {response: "strongly disagree", frequency: .41}]}
]};

// fake data
var twocounty_data = {
  question: "I like Ice Cream",
    region_responses: [
      {region: "Latah",
       responses: [{response: "strongly agree", frequency: .2},
                   {response: "somewhat agree", frequency: .55}, 
                   {response: "neutral", frequency: .1}, 
                   {response: "somewhat disagree", frequency: .35},
                   {response: "strongly disagree", frequency: .35}]},
      {region: "Whitman",
       responses: [{response: "strongly agree", frequency: .4},       
                   {response: "somewhat agree", frequency: .25}, 
                   {response: "neutral", frequency: .2}, 
                   {response: "somewhat disagree", frequency: .65},
                   {response: "strongly disagree", frequency: .15}]}
]};
//
// fake data
var threecounty_data = {
  question: "I like Ice Cream",
    region_responses: [
      {region: "Latah",
       responses: [{response: "strongly agree", frequency: .2},
                   {response: "somewhat agree", frequency: .55}, 
                   {response: "neutral", frequency: .1}, 
                   {response: "somewhat disagree", frequency: .35},
                   {response: "strongly disagree", frequency: .35}]},
      {region: "Whitman",
       responses: [{response: "strongly agree", frequency: .15},       
                   {response: "somewhat agree", frequency: .15}, 
                   {response: "neutral", frequency: .1}, 
                   {response: "somewhat disagree", frequency: .45},
                   {response: "strongly disagree", frequency: .15}]},
      {region: "IDAHO",
       responses: [{response: "strongly agree", frequency: .5},       
                   {response: "somewhat agree", frequency: .55}, 
                   {response: "neutral", frequency: .1}, 
                   {response: "somewhat disagree", frequency: .15},
                   {response: "strongly disagree", frequency: .15}]}
]};

var threecounty_threeresponse = {
  question: "I like Ice Cream",
    region_responses: [
      {region: "Latah",
       responses: [{response: "strongly agree", frequency: .2},
                   {response: "somewhat agree", frequency: .55}, 
                   {response: "neutral", frequency: .1}]},
      {region: "Whitman",
       responses: [{response: "strongly agree", frequency: .15},       
                   {response: "somewhat agree", frequency: .15}, 
                   {response: "neutral", frequency: .1}]},
      {region: "IDAHO",
       responses: [{response: "strongly agree", frequency: .5},       
                   {response: "somewhat agree", frequency: .55}, 
                   {response: "neutral", frequency: .1}]}
]};


/// Get all regions present in data_array
var getRegions = function(data_array)
{
    return data_array.map(function(el) { return el.region; });
} 
/// Globals
BAR_YPAD = 2;
BAR_SPACING = 4;
MAX_BAR_WIDTH = 50;
//SVG_HEIGHT = 350;
SVG_WIDTH = 600;
/**
 * Function to return the y-position of a bar given bar width and number of
 * responses (ordinal y-axis values)
 */
var calculateYValue = function(idx, nCounties, nResponses)
{
  // floor is which location inside the response (1-nResp) the bar goes
  // second factor is the width of a single bar, max refers to if nC = 1
  intraResponseTranslation = 
    Math.floor(idx/nResponses) * (MAX_BAR_WIDTH/nCounties);

  interResponseTranslation = 
    (idx % nResponses) * (MAX_BAR_WIDTH + BAR_SPACING);
  
  return intraResponseTranslation + interResponseTranslation;
} 

/**
 * USING ONE COUNTY DATA
 */
// create svg_1 space
//var svg_1 = d3.select("#plots")
            //.append("svg")
            //.attr("width", width)
            //.attr("height", height);

// "response" is again referring to, eg, 'strongly agree' or 'conventional'
RESPONSE_WIDTH = 150;

var margin = {top: 35, right: 10, left:RESPONSE_WIDTH, bottom:24};

// plot does not include margins (axes, labels, title, etc)
plot_height = 270;
plot_width = 340;

/// when reading from python, need to round up either in py or here, eg, ceil({{ max_freq }})
max_freq_1cnty = 0.6;

svg_1cnty = d3.select("#plot1")
              .append("svg")
              .attr("width", plot_width + margin.left + margin.right)
              .attr("height", plot_height + margin.top + margin.bottom);

/// set thickness of guide lines
var base_thickness = 3, guide_thickness = 1;
/// insert guide lines
svg_1cnty.selectAll("line")
         .data(d3.range(0, max_freq_1cnty + 0.1, .1))
         .enter()
         .append("line")
         .attr("class", "axis")
         .attr({
             "x1": function(d) { return margin.left + (1.0/max_freq_1cnty)*d*plot_width; },
             "x2": function(d) { return margin.left + (1.0/max_freq_1cnty)*d*plot_width; },
             "y1": margin.top,
             "y2": margin.top + plot_height,

             "stroke": function(d) {
               if (d == 0) { return "black"; } else { return "lightgrey"; }
             },

             "stroke-width": function(d) { 
               if (d == 0) 
               { 
                 return base_thickness; 
               } 
               else 
               { 
                 return guide_thickness; 
               } 
             }
         });

var tick_font_size = 15;
svg_1cnty.selectAll("g")
         .data(d3.range(0, max_freq_1cnty + 1, .1))
         .enter()
         .append("text")
         .attr("class", "freq-label")
         .text(function(d) { return d; })
         .attr({
             "font-size": tick_font_size,
             "y": margin.top + plot_height + tick_font_size,
             "x": function(d) { return margin.left + (1.0/max_freq_1cnty)*d*plot_width; }
         });

var question = onecounty_data.question, question_font_size = margin.top - 4;
;
svg_1cnty.append("text")
         .attr("class", "title")
         .text(question)
         .attr({
            "x": margin.left + (plot_width)/2.0,
            "y": margin.top - 12.0,
            "font-size": question_font_size
         });


         //.attr("

var reg_resps = onecounty_data.region_responses;
var all_resps_no_region = [];
for (var i=0; i < reg_resps.length; i++)
{
  all_resps_no_region = all_resps_no_region.concat(reg_resps[i].responses); 
} 

console.log(all_resps_no_region);

RESPONSE_WIDTH_5 = 50;
RESPONSE_BARS_SPACING = 4;
svg_1cnty.selectAll("rect")
         .data(all_resps_no_region)
         .enter()
         .append("rect")
         .attr({
             "height": RESPONSE_WIDTH_5,
             "width": function(d) { return (1.0/max_freq_1cnty)*d.frequency*plot_width; },
             "y": function(d,i) { return margin.top + BAR_YPAD + calculateYValue(i, 1, 5); },
             "x": margin.left + (base_thickness/2.0),
             "fill": function(d, i) {
                if (i % 1 == 0) {
                    return "blue";
                } else if (i % 1 == 1) {
                    return "brown";
                } else  {
                    return "green";
                } 
             },
         }); 


var resps = all_resps_no_region.slice(0,6)
                           .map(function (el) { return el.response; });

console.log(resps);

svg_1cnty.selectAll("g")
         .data(resps)
         .enter()
         .append("text")
         .attr("class", "response-label")
         .text(function(d) { return d; })
         .attr({
           "font-size": tick_font_size,
           "y": function(d, i) {
               return (plot_height/5.0) * i + margin.top + 
                      tick_font_size/2.0 + RESPONSE_WIDTH_5/2.0;
           },
           "x": margin.left - tick_font_size/2.0
         });

/**
 * BEGIN 2 COUNTY EXAMPLE
 */
//svg_2cnty = d3.select("#plot2")
              //.append("svg")
              //.attr("width", width)
              //.attr("height", HEIGHT);

//svg_2cnty.selectAll("line")
         //.data(d3.range(0, 1.1, .1))
         //.enter()
         //.append("line")
         //.attr("class", "axis")
         //.attr({
             //"x1": function(d) { return d*SVG_WIDTH; },
             //"x2": function(d) { return d*SVG_WIDTH; },
             //"y1": 0,
             //"y2": HEIGHT,
             //"stroke": function(d) {
               //if (d == 0) { return "black"; } else { return "lightgrey"; }
             //},
             //"stroke-width": function(d) { 
               //if (d == 0) { return base_thickness; } else { return guide_thickness; } 
             //}
         //});

//var question = twocounty_data.question;
//var reg_resps_2 = twocounty_data.region_responses;
//var all_resps_no_region_2 = [];
//for (var i=0; i < reg_resps_2.length; i++)
//{
  //all_resps_no_region_2 = all_resps_no_region_2.concat(reg_resps_2[i].responses); 
//} 

//console.log(all_resps_no_region_2);

//resps = all_resps_no_region.slice(0,5)
                           //.map(function (el) { return el.response; });

//RESPONSE_WIDTH_5 = 50;
//RESPONSE_BARS_SPACING = 4;
//svg_2cnty.selectAll("rect")
         //.data(all_resps_no_region_2)
         //.enter()
         //.append("rect")
         //.attr({
             //"height": RESPONSE_WIDTH_5 / 2.0,
             //"width": function(d) { return d.frequency*width; },
             //"y": function(d,i) { return BAR_YPAD + calculateYValue(i, 2, 5); },
             //"x": 1.5,
             //"fill": function(d, i) {
               //console.log(i % 1);
                //if (i % 2 == 0) {
                    //return "blue";
                //} else if (i % 2 == 1) {
                    //return "brown";
                //} else  {
                    //return "green";
                //} 
             //},
         //}); 

//// put in labels for rectangles
////svg_1.selectAll("text")
   ////.data(dataset)
   ////.enter()
   ////.append("text")
   ////.text(function(d) { return d.response; })
   ////.attr("font-size", 16)
   ////.attr("font-family", "sans-serif")
   //////.attr("font-align", "right")
   ////.attr("x", 0)
   ////.attr("y", function(d, i) { return padding.top + i*50 + 32; });
   

////// put in rectangles
////svg_1.selectAll("rect")
   ////.data(dataset)
   ////.enter()
   ////.append("rect")
   ////.attr("x", responseWidth)
   ////.attr("y", function(d, i) { return padding.top + i*50; })
   ////.attr("fill", "dodgerblue")
   //////.attr("width", 20)
   //////.attr("height", 100);
   ////.attr("width", function(d) { return d.frequency*width; })
   ////.attr("height", 45);


////// add text of frequency values
////svg_1.selectAll("g")
   ////.attr("class", "data-values")
   ////.data(dataset)
   ////.enter()
   ////.append("text")
   ////.text(function(d) { return d.frequency; })
   ////.attr("x", function(d) { return responseWidth + d.frequency*width + 10; })
   ////.attr("y", function(d, i) { return padding.top + i*50 + 32; });

////// add title
////svg_1.append("text")
   ////.attr("class", "plot-title")
   //////.append("text")
   ////.text("I'm the first title")
   ////.attr("text-anchor", "middle")
   ////.attr("x", width/2.0)
   ////.attr("y", 20);
  
