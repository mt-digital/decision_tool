/**
 * File: templates/barchart.js
 */
var n_regions = {{ n_regions|safe }};
var datasets = {{ json_data|safe }};

var colors = ["dodgerblue", "orange", "green"];

var response_width = 170, legend_text_width = 270;

var margin = {top: 35, right: legend_text_width, 
              left: response_width, bottom: 60};
// strong agree, somewhat agree, neutral, somewhat disagg, strong disagg
var max_responses = 5;

var bar_ypad = 8,
    min_bar_spacing = 15,
    max_bar_height = 60;

var bar_ypad = 8;

var total_bar_height = max_bar_height*max_responses;

var plot_height = max_bar_height*max_responses + bar_ypad*2 + (max_responses-1)*min_bar_spacing ; //310; // 270;
var plot_width = 390;

var tick_font_size = 17;

var reg_resps = datasets.map(function(el) { return el.region_responses; });
var resps = [];
for (var i=0; i < 5; i++)
{
  var resps = resps.concat(reg_resps[i].map(function(el) { return el.responses; }));//reg_resps.map(function(el) { return el.responses; });
}

var frequencies = [];

for (var i=0; i < resps.length; i++)
{
  frequencies = frequencies.concat(resps[i].map(function(el) { return el.frequency; }));
}


// round up to the nearest tenth
var max_freq = Math.ceil(Math.max.apply(Math, frequencies) * 10)/10;


var scaled_width = (1.0/max_freq)*plot_width;


var base_thickness = 1, guide_thickness = 1;
var make_guide_lines = function(svg, dataset)
{
  svg.selectAll("line")
     .data(d3.range(0, max_freq + .1,  .1))
     .enter()
     .append("line")
     .attr("class", "axis")
     .attr({
         "x1": function(d) { return margin.left + scaled_width*d; },
         "x2": function(d) { return margin.left + scaled_width*d; },
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
}

var make_tick_labels = function(svg)
{
  svg.selectAll("g")
     .data(d3.range(0, max_freq + .1, .1))
     .enter()
     .append("text")
     .attr("class", "freq-label")
     .text(function(d) { return d; })
     .attr({
         "font-size": tick_font_size,
         "y": margin.top + plot_height + tick_font_size,
         "x": function(d) { return margin.left + scaled_width*d; }
     });
} 

/**
 * Make a legend, assuming the dataset is a single question's dataset
 */
var make_legend = function(svg, dataset)
{
  var regions = dataset.region_responses.map(function(el){ return el.region; });
  var font_size = 16;
  
  
  svg.selectAll("g")
     .data(regions)
     .enter()
     .append("rect")
     .attr({
         "fill": function(d, i) { return colors[i]; },
         "x": margin.left + plot_width + font_size,
         "y": function(d, i) {
           return margin.top*2 + i*(plot_height/3.0) - font_size + 3;
         },
         "width": font_size,
         "height": font_size
     }); 

  svg.selectAll("g")
     .data(regions)
     .enter()
     .append("text")
     .attr({
        "x": margin.left + plot_width + 2.5*font_size,
        "y": function(d, i) { 
          // max n_regions = 3.0
          return margin.top*2 + i*(plot_height/3.0);
        },
        "font-size": font_size
     })
     .attr("class", "legend-label")
     .text(function(d) { return d; }); 
} 

var make_response_labels = function(svg, dataset)
{
    var region_responses = dataset.region_responses;
    var all_resps_no_region = [];
    for (var i=0; i < region_responses.length; i++)
    {
        all_resps_no_region = 
          all_resps_no_region.concat(region_responses[i].responses);
    } 
    var responses = 
      region_responses[0].responses.map(function(el) { return el.response; });
    
    svg.selectAll("g")
       .data(responses)
       .enter()
       .append("text")
       .attr("class", "response-label")
       .text(function(d) { return d; })
       .attr({
         "font-size": tick_font_size,
         "y": function(d, i) {
             return calculate_y_value(i, n_regions, responses.length) + max_bar_height/2.0 + margin.top + tick_font_size;
         
         //(plot_height/responses.length) * i + margin.top + 
                    //tick_font_size/2.0 + max_bar_height/2.0;
         },
         "x": margin.left - tick_font_size/2.0
       });

    return responses.length;
} 


/**
 * Make some rectangles. Expectes a single question dataset 
 */
var make_bars = function(svg, dataset, n_regions, n_responses)
{
  var region_responses = dataset.region_responses;
  var all_resps_no_region = [];
  for (var i=0; i < region_responses.length; i++)
  {
      all_resps_no_region = 
        all_resps_no_region.concat(region_responses[i].responses);
  } 
  var bar_height = Math.floor(max_bar_height / n_regions);

  svg.selectAll("g")
     .data(all_resps_no_region)
     .enter()
     .append("rect")
     .attr({
         "height": bar_height,
         "width": function(d) { return d.frequency*scaled_width; },
         "y": function(d,i) { return margin.top + bar_ypad + 
                              calculate_y_value(i, n_regions, n_responses); },
         "x": margin.left + base_thickness, //(base_thickness/2.0),
         "fill": function(d, i) {
            if (i < n_responses) {
                return colors[0];
            } else if (i < 2*n_responses) {
                return colors[1];
            } else  {
                return colors[2];
            } 
         },
     }); 
}


/**
 * Helper function to make_plots to return the y-position of a bar given bar 
 * width and number of responses (ordinal y-axis values)
 */
var calculate_y_value = function(idx, n_regions, n_responses)
{
  // floor is which location inside the response (1-nResp) the bar goes
  // second factor is the width of a single bar, max refers to if nC = 1
  intraResponseTranslation = 
    Math.floor(idx/n_responses) * (max_bar_height/n_regions);

  interResponseTranslation = 
    (idx % n_responses) * 
      (max_bar_height + 
       (min_bar_spacing + (bar_ypad + max_bar_height*1.1)*((5 - n_responses)/(n_responses - 1))));
  
  return intraResponseTranslation + interResponseTranslation;
} 

/**
 * Main driver of plot making. Give it the JSON datsets and it does the rest
 */
var make_plots = function(datasets, n_regions)
{
  /* get all the response frequencies and find the maximum.
   * the largest frequency value rep'd on guides will be max rounded up to tenth
   */
  //var all_response_freqs = 
  //var max_freq = 0.7;
  
  var questions = datasets.map(function(el){ return el.question; }); 

  for (var i=1; i < datasets.length + 1; i++)
  {
    var svg = d3.select("#plot" + i)
                .append("svg")
                .attr("width", plot_width + margin.left + margin.right)
                .attr("height", plot_height + margin.top + margin.bottom);

    var dataset = datasets[i-1];

    make_guide_lines(svg, max_freq);
    
    // make title
    //var title_font_size = 18;
    //var long_title_size = 15;
    // the third one has a long title
    var full_title_font_size = 20;
    var smaller_title_font_size = full_title_font_size - .2*full_title_font_size
    var title_font_size = (i != 4) ? full_title_font_size 
                                   : smaller_title_font_size;
    svg.append("text")
         .attr("class", "title")
         .text(questions[i-1])
         .attr({
            "x": margin.left + (plot_width)/2.0,
            "y": margin.top - 12.0,
            "font-size": title_font_size
         });

    svg.append("text")
        .attr("class", "x-label")
        .text("% Response")
        .attr({
          "x": margin.left + plot_width/2.0,
          "y": margin.top + margin.bottom + plot_height - .4*full_title_font_size,
          "font-size": full_title_font_size,
          "text-anchor": "middle",
          "font-weight": "bold"
        });

    make_guide_lines(svg, dataset);

    make_legend(svg, dataset);

    make_tick_labels(svg, max_freq);

    var n_responses = make_response_labels(svg, dataset);

    make_bars(svg, dataset, n_regions, n_responses);
  }
};

make_plots(datasets, n_regions);
