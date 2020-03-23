const getUrl = endpoint => `http://localhost:5000/${endpoint}`;


d3.json(getUrl("vitamins")).then(res => {
    console.log(res);
});


d3.json(getUrl("metamucil")).then(res => {
    console.log(res);
});


d3.json(getUrl("pull-ups")).then(res => {
    const parseDate = d3.timeParse("%m/%d/%Y");

    const data = Object.entries(res)
          .map(d => ({date: parseDate(d[0]), value: d[1]}))
          .filter(d => d.value > 0);

    const margin = ({top: 20, right: 30, bottom: 30, left: 40});

    const width = 500;
    const height = 500;

    const x = d3.scaleUtc()
          .domain(d3.extent(data, d => d.date))
          .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.value)]).nice()
          .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = g => g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .call(g => g.select(".domain").remove())
          .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

    const line = d3.line()
          .defined(d => !isNaN(d.value))
          .x(d => x(d.date))
          .y(d => y(d.value));

    const svg = d3.select("#chart").append("svg")
          .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

}).catch(err => console.log);
