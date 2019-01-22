(function() {

		var previews = document.querySelectorAll("div.linkPreview");
		if (previews.length === 0)
			return;
	
		console.log(previews);

		previews.forEach((prev) => {
			let link = prev.querySelector('a');
			fetch(`https://cors-anywhere.herokuapp.com/${link.href}`, {
				method: 'GET',
				headers: {
					'access-control-allow-origin': '*'
				}
			})
			.then((res) => res.text())
			.then((html) => {
            	html = html.replace(/<\/?[A-Z]+[\w\W]*?>/g, function (m) {
                	return m.toLowerCase();
            	});

            	let dom = document.implementation.createHTMLDocument('');
            	dom.querySelector('html').innerHTML = html;
            	
            	let description = dom.querySelector("meta[name='description']") ||
            					  dom.querySelector("meta[property='og:description']") ||
            					  dom.querySelector("meta[property='description']");

            	return {
            		title : dom.querySelector('title').innerText,
            		url : link.href, // parent scope
            		description : description.innerText || description.content || description.value,
            		image : dom.querySelector('img'),
            	}
			})
			.then((data) => {
				prev.innerText = `
					${data.title} \n
					${data.description} \n
					${data.url} \n
				`;
			}).catch(err => console.log(err));
		})

})()