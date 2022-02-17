const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest(),
    values = [],
    data,
    heightScale,
    xScale,
    xAxisScale,
    yAxisScale;
const width = 800,
    height = 600,
    padding = 40;

const svg = d3.select("svg");

const drawCanvas = () => {
    svg.attr("width", width);
    svg.attr("height", height);
};

const generateScales = () => {
    heightScale = d3
        .scaleLinear()
        .domain([0, d3.max(values, (item) => item[1])])
        .range([0, height - 2 * padding]);

    xScale = d3
        .scaleLinear()
        .domain([0, values.length - 1])
        .range([padding, width - padding]);

    const datesArray = values.map((item) => new Date(item[0]));

    xAxisScale = d3
        .scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding]);

    yAxisScale = d3
        .scaleLinear()
        .domain([0, d3.max(values, (item) => item[1])])
        .range([height - padding, padding]);
};

const drawBars = () => {
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")
        .style("width", "auto")
        .style("height", "auto");

    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (item) => item[0])
        .attr("data-gdp", (item) => item[1])
        .attr("width", (width - 2 * padding) / values.length)
        .attr("height", (item) => heightScale(item[1]))
        .attr("x", (item, index) => xScale(index))
        .attr("y", (item) => height - padding - heightScale(item[1]))
        .on("mouseover", (item) => {
            tooltip.transition().style("visibility", "visible");
            tooltip.text(item[0]);
            document
                .querySelector("#tooltip")
                .setAttribute("data-date", item[0]);
        })
        .on("mouseout", (item) => {
            tooltip.transition().style("visibility", "hidden");
            tooltip.text(item[0]);
        });
};

const generateAxes = () => {
    const xAxis = d3.axisBottom(xAxisScale);
    const yAxis = d3.axisLeft(yAxisScale);

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (height - padding) + ")");

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)");
};

req.open("GET", url, true);
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    drawCanvas();
    generateScales();
    drawBars();
    generateAxes();
};
req.send();
