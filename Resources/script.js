


d3.json("./Resources/data/csvjson.json", function(data) {

let width = 800;
let barWidth = 10;
let height = 400;
let barScale = 1000;

let genderD = data;
    console.log(genderD);


let genderScale = d3.scaleLinear()
                    .domain([0, 32.4])
                    .range([0, 400]);


let genderGraph = d3.select("figure")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)


let genderBar = genderGraph.selectAll("g")
                    .data(genderD)
                    .enter()
                    .append("g")
                    .text(function(d){
                        return d.Geschlecht
                    })
                    .attr("transform", function(d,i){
                        return "translate(" + i * barWidth + ", 0)"
                    })

                    .data(genderD)
                    .append("rect")

                    .attr("height", function(d, barScale){
                     return genderScale(d.Geschlecht);
                 })
                    .attr("y", function(d){
                     return 400 - genderScale(d.Geschlecht);
                    })
                    .attr("width", barWidth)
                     
      

                    .data(genderD)
                    .enter()
                    .append("text")
                    
                    
                    .text(function(d){
                        return d.Jahr
                    })
                    
    


                    


});


